import './CodeEditor.css'

export default function CodeEditor() {
  const code = `#include <stdio.h>
#include <stdlib.h>

int main() {
    int *ptr = malloc(sizeof(int));
    *ptr = 42;
    
    printf("Value: %d\\n", *ptr);
    printf("Address: %p\\n", (void*)ptr);
    
    free(ptr);
    return 0;
}`

  return (
    <div className="code-editor">
      <div className="editor-gutter">
        {code.split('\\n').map((_, i) => (
          <div key={i} className="line-number">{i + 1}</div>
        ))}
      </div>
      <pre className="editor-content">
        <code>{code}</code>
      </pre>
    </div>
  )
}
