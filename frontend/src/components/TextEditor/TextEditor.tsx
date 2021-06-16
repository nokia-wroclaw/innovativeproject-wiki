/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-param-reassign */
import { Button, Icon, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { jsPDF } from 'jspdf';
import escapeHtml from 'escape-html';
import isHotkey from 'is-hotkey';
import isUrl from 'is-url';
import imageExtensions from 'image-extensions';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  createEditor,
  Descendant,
  Editor,
  Element as SlateElement,
  Transforms,
  Text,
} from 'slate';
import { withHistory } from 'slate-history';
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  useSlate,
  withReact,
  ReactEditor,
  useSelected,
  useFocused,
} from 'slate-react';
import Paper from '@material-ui/core/Paper';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { AppContext } from '../../contexts/AppContext';
import { getCookie } from '../../contexts/Cookies';
import { ImageElement } from './custom-types';

const useStyles = makeStyles((theme) => ({
  slate: {
    display: 'flex',
    flexDirection: 'column',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  editable: {
    width: '21cm',
    minHeight: '29.7cm',
    padding: 40,
    paddingLeft: 80,
    paddingRight: 80,
    textAlign: 'left',
  },
}));

const HOTKEYS: Record<string, string> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TextEditor = (props: any) => {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(
    () => withImages(withHistory(withReact(createEditor()))),
    []
  );
  const selectedWorkspace = props.workspaceName;

    

  const classes = useStyles();

  const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ] as Descendant[];

  const [value, setValue] = useState<Descendant[]>(initialValue);
  const [firstPost, setFirstPost] = useState(true);


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serialize = (node: any) => {
    if (Text.isText(node)) {
      let string = escapeHtml(node.text);
      console.log(node);
      if (node.bold) {
        string = `<strong>${string}</strong>`;
      }
      if (node.italic) {
        string = `<i>${string}</i>`;
      }
      if (node.underline) {
        string = `<ins>${string}</ins>`;
      }
      if (node.code) {
        string = `<code>${string}</code>`;
      }
      return string;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const children = node.children.map((n: any) => serialize(n)).join('');
    console.log(node.type);

    switch (node.type) {
      case 'paragraph':
        return `<p>${children}</p>`;
      case 'bulleted-list':
        return `<ul>${children}</ul>`;
      case 'numbered-list':
        return `<ol>${children}</ol>`;
      case 'list-item':
        return `<li>${children}</li>`;
      // case 'align-center':
      //   return `<p style={{ textAlign: 'center' }}>${children}</p>`;
      case 'link':
        return `<a href="${escapeHtml(node.url)}">${children}</a>`;
      default:
        return children;
    }
  };

  const onExportClick = () => {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF('p', 'pt', 'a4');

    doc.html(serialize(editor), {
      callback() {
        doc.save(`${props.fileName}.pdf`);
      },
    });

    console.log(serialize(editor));
  };

  useEffect(() => {
    const token = getCookie('token');
    if (token && selectedWorkspace && typeof props.fileName !== 'undefined') {
      fetch(
        `/api/document/${props.fileName}?workspace_name=${selectedWorkspace}`,
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer '.concat(token),
            'Content-Type': 'application/json',
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          Transforms.select(editor, [0]);
          setValue(data);
        })
        .catch((error) => {
          console.error('Error: ', error);
        });
    }
  }, [props.fileName, selectedWorkspace]);

  return (
    <div className={classes.slate}>
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => {

          if(firstPost)
          {
            setFirstPost(false);
            return;
          }

          setValue(newValue);
          const content = JSON.stringify(newValue);

          // make API request for doc save
          const token = getCookie('token');

          if (token) {
            if (selectedWorkspace && typeof props.fileName !== 'undefined') {
              fetch(
                `/api/document/${props.fileName}?workspace_name=${selectedWorkspace}`,
                {
                  method: 'POST',
                  headers: {
                    Authorization: 'Bearer '.concat(token),
                    'Content-Type': 'application/json',
                  },
                  body: content,
                }
              )
                .then((response) => response.json())
                .then((data) => {})
                .catch((error) => {
                  console.error('Error:');
                });
            }
          }
        }}
      >
        <Paper elevation={10} className={classes.toolbar}>
          <Toolbar>
            <InsertImageButton />
            <MarkButton format="bold" icon="format_bold" />
            <MarkButton format="italic" icon="format_italic" />
            <MarkButton format="underline" icon="format_underlined" />
            <MarkButton format="code" icon="code" />
            <BlockButton format="heading-one" icon="looks_one" />
            <BlockButton format="heading-two" icon="looks_two" />
            <BlockButton format="numbered-list" icon="format_list_numbered" />
            <BlockButton format="bulleted-list" icon="format_list_bulleted" />
            <BlockButton format="align-left" icon="format_align_left" />
            <BlockButton format="align-center" icon="format_align_center" />
            <BlockButton format="align-right" icon="format_align_right" />
            <Button variant="text" onClick={onExportClick}>
              <CloudDownloadIcon />
            </Button>
          </Toolbar>
        </Paper>
        <Paper elevation={10} className={classes.editable}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            // placeholder="Enter some rich text…"
            spellCheck
            autoFocus
            onKeyDown={(event) => {
              for (const hotkey in HOTKEYS) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (isHotkey(hotkey, event as any)) {
                  event.preventDefault();
                  const mark: string = HOTKEYS[hotkey];
                  toggleMark(editor, mark);
                }
              }
            }}
          />
        </Paper>
      </Slate>
    </div>
  );
};

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type as string),
    split: true,
  });
  const newProperties: Partial<SlateElement> = {
    // eslint-disable-next-line no-nested-ternary
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  };
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toggleMark = (editor: Editor, format: any) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isBlockActive = (editor: Editor, format: any) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });

  return !!match;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isMarkActive = (editor: Editor, format: any) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }: RenderElementProps) => {
  switch (element.type) {
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    case 'align-left':
      return (
        <p {...attributes} style={{ textAlign: 'left' }}>
          {children}
        </p>
      );
    case 'align-center':
      return (
        <p {...attributes} style={{ textAlign: 'center' }}>
          {children}
        </p>
      );
    case 'align-right':
      return (
        <p {...attributes} style={{ textAlign: 'right' }}>
          {children}
        </p>
      );
    case 'image':
      return (
        <Image attributes={attributes} element={element}>
          {children}
        </Image>
      );
    default:
      return (
        <p {...attributes} style={{ textAlign: 'left' }}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BlockButton = ({ format, icon }: any) => {
  const editor = useSlate();
  return (
    <Button
      variant={isBlockActive(editor, format) ? 'contained' : 'text'}
      onClick={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MarkButton = ({ format, icon }: any) => {
  const editor = useSlate();
  return (
    <Button
      variant={isMarkActive(editor, format) ? 'contained' : 'text'}
      onClick={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

const withImages = (editor: ReactEditor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) =>
    element.type === 'image' ? true : isVoid(element);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor.insertData = (data: any) => {
    const text = data.getData('text/plain');
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split('/');

        if (mime === 'image') {
          reader.addEventListener('load', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const url = reader.result as any;
            insertImage(editor, url);
          });

          reader.readAsDataURL(file);
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const insertImage = (editor: Editor, url: string) => {
  const text = { text: '' };
  const image: ImageElement = { type: 'image', url, children: [text] };
  Transforms.insertNodes(editor, image);
};

const Image = ({ attributes, children, element }: RenderElementProps) => {
  const selected = useSelected();
  const focused = useFocused();
  return (
    <div {...attributes}>
      <div contentEditable={true}>
        <img
          src={element.url as string}
          alt="a"
          style={{
            display: 'block',
            maxWidth: '100%',
            maxHeight: '20em',
            boxShadow: `${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'}`,
          }}
        />
      </div>
      {children}
    </div>
  );
};

const InsertImageButton = () => {
  const editor = useSlate();
  return (
    <Button
      onMouseDown={(event) => {
        event.preventDefault();
        const url = window.prompt('Enter the URL of the image:');
        if (url && !isImageUrl(url)) {
          alert('URL is not an image');
          return;
        }
        if (url !== null) insertImage(editor, url);
      }}
    >
      <Icon>image</Icon>
    </Button>
  );
};

const isImageUrl = (url: string) => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url).pathname.split('.').pop();
  if (typeof ext !== 'undefined') return imageExtensions.includes(ext);
};

export default TextEditor;
