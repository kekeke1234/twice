import './CodeEditor.css';

export default function CodeEditor({ code, onChange, theme = 'default' }) {
  const lineCount = code.split('\n').length;

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const spaces = '    ';
      const newCode = code.substring(0, start) + spaces + code.substring(end);
      onChange(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + spaces.length;
      }, 0);
    }

    if (e.key === '"') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '""' + code.substring(end);
      onChange(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 1;
      }, 0);
    }

    if (e.key === '(') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '()' + code.substring(end);
      onChange(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 1;
      }, 0);
    }
  };

  return (
    <div className={`code-editor theme-${theme}`}>
      <div className="editor-gutter">
        {Array.from({ length: Math.max(lineCount, 15) }).map((_, i) => (
          <div key={i} className="line-number">{i + 1}</div>
        ))}
      </div>
      <textarea
        className="editor-textarea"
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck="false"
      />
    </div>
  );
}
