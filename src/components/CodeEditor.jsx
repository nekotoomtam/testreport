import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { EditorView } from '@codemirror/view';

const editorTheme = EditorView.theme(
  {
    '&': {
      height: '100%',
      backgroundColor: '#ffffff',
      color: '#172033',
      fontSize: '0.95rem',
    },
    '.cm-scroller': {
      fontFamily: '"Cascadia Code", "Fira Code", Consolas, monospace',
      height: '100%',
      lineHeight: '1.55',
      overflow: 'auto',
    },
    '.cm-content': {
      minWidth: 'max-content',
      padding: '16px 0',
    },
    '.cm-line': {
      padding: '0 18px',
    },
    '.cm-gutters': {
      backgroundColor: '#f6f8fb',
      color: '#69778a',
      borderRight: '1px solid #d9e2ec',
    },
    '.cm-activeLine': {
      backgroundColor: '#f1f5fa',
    },
    '.cm-activeLineGutter': {
      backgroundColor: '#edf3f8',
      color: '#172033',
    },
    '.cm-selectionBackground': {
      backgroundColor: '#cfe0ff !important',
    },
    '.cm-cursor': {
      borderLeftColor: '#172033',
    },
    '&.cm-focused': {
      outline: '3px solid #8fb7ff',
      outlineOffset: '2px',
    },
  },
  { dark: false },
);

const readableHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: '#7c2d8a', fontWeight: '700' },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: '#0b5fc7' },
  { tag: [tags.variableName, tags.definition(tags.variableName)], color: '#172033' },
  { tag: tags.propertyName, color: '#1d5d47' },
  { tag: tags.number, color: '#7a4d00' },
  { tag: tags.string, color: '#9a3412' },
  { tag: tags.comment, color: '#64748b', fontStyle: 'italic' },
  { tag: tags.operator, color: '#475569' },
  { tag: tags.punctuation, color: '#475569' },
  { tag: tags.bracket, color: '#475569' },
  { tag: tags.invalid, color: '#991b1b', textDecoration: 'underline' },
]);

const editorExtensions = [
  javascript(),
  editorTheme,
  syntaxHighlighting(readableHighlightStyle),
];

function CodeEditor({ id, value, onChange, readOnly = false, height = '360px' }) {
  return (
    <div id={id} className="codeEditorShell" style={{ height }}>
      <CodeMirror
        value={value}
        height="100%"
        basicSetup
        editable={!readOnly}
        readOnly={readOnly}
        extensions={editorExtensions}
        onChange={(nextValue) => onChange(nextValue)}
      />
    </div>
  );
}

export default CodeEditor;
