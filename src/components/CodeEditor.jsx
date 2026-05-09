import './CodeEditor.css'

export default function CodeEditor({ code, onChange }) {
  const lineCount = code.split('\n').length

  return (
    <div className="code-editor">
      <div className="editor-gutter">
        {Array.from({ length: Math.max(lineCount, 15) }).map((_, i) => (
          <div key={i} className="line-number">{i + 1}</div>
        ))}
      </div>
      <textarea
        className="editor-textarea"
        value={code}
        onChange={(e) => onChange(e.target.value)}
        spellCheck="false"
      />
    </div>
  )
}
