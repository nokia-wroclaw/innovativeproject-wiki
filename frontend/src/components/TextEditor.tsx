// Import React dependencies.
import React, { useCallback, useEffect, useMemo, useState } from 'react';
// Import the Slate editor factory.
import { createEditor, Node, Transforms, Editor, Text } from 'slate';

// Import the Slate components and React plugin.
import {
  Slate,
  Editable,
  withReact,
  RenderLeafProps,
  RenderElementProps,
} from 'slate-react';

const Leaf = (props: RenderLeafProps) => (
  <span
    {...props.attributes}
    style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
  >
    {props.children}
  </span>
);

const CodeElement = (props: RenderElementProps) => (
  <pre {...props.attributes}>
    <code>{props.children}</code>
  </pre>
);

const DefaultElement = (props: RenderElementProps) => (
  <p {...props.attributes}>{props.children}</p>
);

const TextEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  // Add the initial value when setting up our state.
  const [value, setValue] = useState<Node[]>([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ]);

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  // Define a leaf rendering function that is memoized with `useCallback`.
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => setValue(newValue)}
    >
      <Editable
        renderElement={renderElement}
        // Pass in the `renderLeaf` function.
        renderLeaf={renderLeaf}
        onKeyDown={(event) => {
          if (!event.ctrlKey) {
            return;
          }

          switch (event.key) {
            case '`': {
              event.preventDefault();
              const [match] = Editor.nodes(editor, {
                match: (n) => n.type === 'code',
              });
              Transforms.setNodes(
                editor,
                { type: match ? null : 'code' },
                { match: (n) => Editor.isBlock(editor, n) }
              );
              break;
            }

            case 'b': {
              event.preventDefault();
              Transforms.setNodes(
                editor,
                { bold: true },
                { match: (n) => Text.isText(n), split: true }
              );
              break;
            }
          }
        }}
      />
    </Slate>
  );
};

export default TextEditor;
