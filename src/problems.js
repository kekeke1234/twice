export const PROBLEMS = [
  {
    id: 'hello-world',
    title: '1. Hello World',
    description: 'Print "Hello, World!" to the console using printf.',
    starterCode: `#include <stdio.h>

int main() {
    // Write your code here
    
    return 0;
}`,
    solution: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`
  },
  {
    id: 'variables',
    title: '2. Variable Sum',
    description: 'Declare two integers a and b, assign them values 10 and 20, and print their sum.',
    starterCode: `#include <stdio.h>

int main() {
    int a = 10;
    int b = 20;
    // Print their sum
    
    return 0;
}`,
    solution: `#include <stdio.h>

int main() {
    int a = 10;
    int b = 20;
    printf("%d\\n", a + b);
    return 0;
}`
  },
  {
    id: 'stack',
    title: '4. Stack Push',
    description: 'Implement a simple stack and push values 10, 20, and 30 onto it.',
    starterCode: `#include <stdio.h>

int main() {
    // Simulate stack operations
    // push(10);
    // push(20);
    // push(30);
    
    return 0;
}`,
    solution: `// Stack simulation logic`
  },
  {
    id: 'queue',
    title: '5. Queue Enqueue',
    description: 'Implement a simple queue and enqueue values 1, 2, and 3.',
    starterCode: `#include <stdio.h>

int main() {
    // Simulate queue operations
    // enqueue(1);
    // enqueue(2);
    // enqueue(3);
    
    return 0;
}`,
    solution: `// Queue simulation logic`
  }
];
