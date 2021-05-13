/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-param-reassign */
import { Button, Icon, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { jsPDF } from 'jspdf';
import escapeHtml from 'escape-html';
import isHotkey from 'is-hotkey';
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
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
} from 'slate-react';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { AppContext } from '../../contexts/AppContext';
import { getCookie } from '../../contexts/Cookies';

const useStyles = makeStyles((theme) => ({
  slate: {
    display: 'flex',
    flexDirection: 'column',
    width: '21cm',
    height: '29.7cm',
    boxShadow: '2px 2px 2px 2px lightgray',
    // borderRadius: '5px',
    padding: 40,
    paddingLeft: 80,
    paddingRight: 80,
    // textAlign: 'left',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
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
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  // const [editor] = useState(() => withHistory(withReact(createEditor())));
  // const editorRef = useRef<ReactEditor>();
  // if (!editorRef.current) editorRef.current = withReact(createEditor());
  // const editor = editorRef.current;

  // const { selectedWorkspace, setSelectedWorkspace } = useContext(AppContext);
  const selectedWorkspace = props.workspaceName;
  // eslint-disable-next-line new-cap
  const doc = new jsPDF();

  const classes = useStyles();

  const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ] as Descendant[];

  const [value, setValue] = useState<Descendant[]>(initialValue);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serialize = (node: any) => {
    if (Text.isText(node)) {
      let string = escapeHtml(node.text);
      if (node.bold) {
        string = `<strong>${string}</strong>`;
      }
      console.log(string);
      return string;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const children = node.children.map((n: any) => serialize(n)).join('');

    switch (node.type) {
      case 'quote':
        return `<blockquote><p>${children}</p></blockquote>`;
      case 'paragraph':
        return `<p>${children}</p>`;
      case 'link':
        return `<a href="${escapeHtml(node.url)}">${children}</a>`;
      default:
        return children;
    }
  };

  const onExportClick = () => {
    doc.html(serialize(editor), {
      callback() {
        doc.save('a4.pdf');
      },
      x: 10,
      y: 10,
    });
    console.log(serialize(editor));
  };

  useEffect(() => {
    const token = getCookie('token');
    if (token && selectedWorkspace && typeof props.fileName !== 'undefined') {
      console.log(props.fileName);

      fetch(`/workspace/${selectedWorkspace}/${props.fileName}`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer '.concat(token),
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Transforms.select(editor, {
          //   anchor: { path: [0, 0], offset: 0 },
          //   focus: { path: [1, 0], offset: 2 },
          // });
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
          setValue(newValue);
          const content = JSON.stringify(newValue);
          // localStorage.setItem(`content`, content);

          // make API request for doc save
          const token = getCookie('token');

          if (token) {
            if (selectedWorkspace && typeof props.fileName !== 'undefined') {
              fetch(`/workspace/${selectedWorkspace}/${props.fileName}`, {
                method: 'POST',
                headers: {
                  Authorization: 'Bearer '.concat(token),
                  'Content-Type': 'application/json',
                },
                body: content,
              })
                .then((response) => response.json())
                .then((data) => {})
                .catch((error) => {
                  console.error('Error:');
                });
            }
          }
        }}
      >
        <Toolbar className={classes.toolbar}>
          <MarkButton format="bold" icon="format_bold" />
          <MarkButton format="italic" icon="format_italic" />
          <MarkButton format="underline" icon="format_underlined" />
          <MarkButton format="code" icon="code" />
          <BlockButton format="heading-one" icon="looks_one" />
          <BlockButton format="heading-two" icon="looks_two" />
          <BlockButton format="block-quote" icon="format_quote" />
          <BlockButton format="numbered-list" icon="format_list_numbered" />
          <BlockButton format="bulleted-list" icon="format_list_bulleted" />
          <Button variant="text" onClick={onExportClick}>
            <CloudDownloadIcon />
          </Button>
        </Toolbar>
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
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
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
    default:
      return <p {...attributes}>{children}</p>;
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

export default TextEditor;
