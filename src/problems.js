export const PROBLEMS = [
  {
    id: 'hello-world',
    titleKey: 'p1Title',
    descKey: 'p1Desc',
    starterCode: `#include <stdio.h>

int main() {
    // Print "Hello, World!" to the console

    return 0;
}`,
  },
  {
    id: 'variables',
    titleKey: 'p2Title',
    descKey: 'p2Desc',
    starterCode: `#include <stdio.h>

int main() {
    int a = 10;
    int b = 20;
    int sum;

    // Calculate sum of a and b

    return 0;
}`,
  },
  {
    id: 'operators',
    titleKey: 'p3Title',
    descKey: 'p3Desc',
    starterCode: `#include <stdio.h>

int main() {
    int a = 15;
    int b = 4;

    // Calculate and print:
    // 1. a + b (addition)
    // 2. a - b (subtraction)
    // 3. a * b (multiplication)
    // 4. a / b (division)
    // 5. a % b (modulo)

    return 0;
}`,
  },
  {
    id: 'if-else',
    titleKey: 'p4Title',
    descKey: 'p4Desc',
    starterCode: `#include <stdio.h>

int main() {
    int num = 7;

    // Print "Even" if num is even, "Odd" if odd

    return 0;
}`,
  },
  {
    id: 'switch-case',
    titleKey: 'p5Title',
    descKey: 'p5Desc',
    starterCode: `#include <stdio.h>

int main() {
    int day = 3;

    // Print the day name using switch:
    // 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday

    return 0;
}`,
  },
  {
    id: 'for-loop',
    titleKey: 'p6Title',
    descKey: 'p6Desc',
    starterCode: `#include <stdio.h>

int main() {
    // Print numbers from 1 to 10 using for loop

    return 0;
}`,
  },
  {
    id: 'while-loop',
    titleKey: 'p7Title',
    descKey: 'p7Desc',
    starterCode: `#include <stdio.h>

int main() {
    int i = 1;

    // Print numbers from 1 to 5 using while loop

    return 0;
}`,
  },
  {
    id: 'function-basic',
    titleKey: 'p8Title',
    descKey: 'p8Desc',
    starterCode: `#include <stdio.h>

// Declare a function that returns the square of a number

int main() {
    int num = 5;
    int result;

    // Call the function and print the result

    return 0;
}`,
  },
  {
    id: 'recursion',
    titleKey: 'p9Title',
    descKey: 'p9Desc',
    starterCode: `#include <stdio.h>

// Implement recursive factorial function

int factorial(int n) {

}

int main() {
    int num = 5;
    // Call factorial and print the result

    return 0;
}`,
  },
  {
    id: 'array-basics',
    titleKey: 'p10Title',
    descKey: 'p10Desc',
    starterCode: `#include <stdio.h>

int main() {
    int arr[5] = {1, 2, 3, 4, 5};

    // Print all elements of the array

    return 0;
}`,
  },
  {
    id: 'pointer-basics',
    titleKey: 'p11Title',
    descKey: 'p11Desc',
    starterCode: `#include <stdio.h>

int main() {
    int num = 42;
    int *ptr;

    // Assign address of num to ptr
    // Print the value of num using ptr

    return 0;
}`,
  },
  {
    id: 'pointer-arithmetic',
    titleKey: 'p12Title',
    descKey: 'p12Desc',
    starterCode: `#include <stdio.h>

int main() {
    int arr[3] = {10, 20, 30};
    int *ptr;

    // Use pointer to access and print all array elements

    return 0;
}`,
  },
  {
    id: 'struct-basics',
    titleKey: 'p13Title',
    descKey: 'p13Desc',
    starterCode: `#include <stdio.h>

struct Student {
    char name[50];
    int age;
    float gpa;
};

int main() {
    struct Student s = {"Kim", 20, 3.8};

    // Print the student's information

    return 0;
}`,
  },
  {
    id: 'malloc-basic',
    titleKey: 'p14Title',
    descKey: 'p14Desc',
    starterCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int *arr;
    int size = 5;

    // Allocate memory for 5 integers using malloc
    // Fill with values 1, 2, 3, 4, 5
    // Print all values
    // Free the memory

    return 0;
}`,
  },
  {
    id: 'linked-list',
    titleKey: 'p15Title',
    descKey: 'p15Desc',
    starterCode: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *next;
};

int main() {
    // Create a linked list with 3 nodes: 10->20->30
    // Traverse and print all values

    return 0;
}`,
  },
  {
    id: 'file-io',
    titleKey: 'p16Title',
    descKey: 'p16Desc',
    starterCode: `#include <stdio.h>

int main() {
    // Create a file "output.txt" and write "Hello, C!" to it
    // Then read and print the content

    return 0;
}`,
  },
  {
    id: 'doubly-linked-list',
    titleKey: 'p17Title',
    descKey: 'p17Desc',
    starterCode: `#include <stdio.h>
#include <stdlib.h>

struct DNode {
    int data;
    struct DNode *prev;
    struct DNode *next;
};

int main() {
    // Create a doubly linked list: 10 <-> 20 <-> 30
    // Traverse from front and print: 10 20 30
    // Traverse from back and print: 30 20 10

    return 0;
}`,
  },
  {
    id: 'stack-calculator',
    titleKey: 'p18Title',
    descKey: 'p18Desc',
    starterCode: `#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <string.h>

#define MAX 100

int stack[MAX];
int top = -1;

void push(int val) { }
int pop() { }
int isEmpty() { }

int main() {
    // Given expression: "3 4 + 2 *" (postfix)
    // Evaluate and print result: 14
    // Hint: 3 + 4 = 7, 7 * 2 = 14

    return 0;
}`,
  },
  {
    id: 'bubble-sort',
    titleKey: 'p19Title',
    descKey: 'p19Desc',
    starterCode: `#include <stdio.h>

void bubbleSort(int arr[], int n) {
    // Implement bubble sort
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = 7;

    bubbleSort(arr, n);

    // Print sorted array: 11 12 22 25 34 64 90

    return 0;
}`,
  },
  {
    id: 'quick-sort',
    titleKey: 'p20Title',
    descKey: 'p20Desc',
    starterCode: `#include <stdio.h>

void quickSort(int arr[], int low, int high) {
    // Implement quick sort
}

int partition(int arr[], int low, int high) {
    // Choose last element as pivot
}

int main() {
    int arr[] = {10, 7, 8, 9, 1, 5};
    int n = 6;

    quickSort(arr, 0, n - 1);

    // Print sorted array: 1 5 7 8 9 10

    return 0;
}`,
  },
  {
    id: 'memory-pool',
    titleKey: 'p21Title',
    descKey: 'p21Desc',
    starterCode: `#include <stdio.h>
#include <stdlib.h>

#define POOL_SIZE 1024
static char memory_pool[POOL_SIZE];
static size_t offset = 0;

void* my_malloc(size_t size) {
    // Implement malloc using memory pool
}

void my_free(void *ptr) {
    // Implement free (optional for simple version)
}

int main() {
    // Allocate 3 blocks: 100, 50, 100 bytes
    // Print allocated addresses
    // Total used should be 250 bytes

    return 0;
}`,
  },
  {
    id: 'hash-table',
    titleKey: 'p22Title',
    descKey: 'p22Desc',
    starterCode: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define TABLE_SIZE 7

struct Node {
    char *key;
    int value;
    struct Node *next;
};

struct Node *hashTable[TABLE_SIZE];

int hash(char *key) {
    // Simple hash function
}

void insert(char *key, int value) {
    // Insert key-value pair using chaining
}

int search(char *key) {
    // Return value if found, -1 if not found
}

int main() {
    // Insert: apple=100, banana=200, cherry=300
    // Search for banana and print value: 200

    return 0;
}`,
  },
  {
    id: 'recursive-file-search',
    titleKey: 'p23Title',
    descKey: 'p23Desc',
    starterCode: `#include <stdio.h>

// Note: This won't work in online compiler
// This is for understanding recursion concept

void search(char *path) {
    // Print current path
    // Recursively search subdirectories
}

int main() {
    // search("/home/user/documents");
    // Just print the concept: "Exploring: /home/user/documents"

    printf("File: /home/user/documents/readme.txt\\n");
    printf("File: /home/user/documents/notes.txt\\n");
    printf("Dir: /home/user/documents/images\\n");
    printf("File: /home/user/documents/images/photo.jpg\\n");

    return 0;
}`,
  },
  {
    id: 'binary-tree',
    titleKey: 'p24Title',
    descKey: 'p24Desc',
    starterCode: `#include <stdio.h>
#include <stdlib.h>

struct TreeNode {
    int data;
    struct TreeNode *left;
    struct TreeNode *right;
};

void preorder(struct TreeNode *root) {
    // Print: root, left, right
}

void inorder(struct TreeNode *root) {
    // Print: left, root, right
}

void postorder(struct TreeNode *root) {
    // Print: left, right, root
}

int main() {
    // Build tree:
    //       1
    //      / \\
    //     2   3
    //    / \\   \\
    //   4   5   6

    struct TreeNode *root = NULL;
    // Build the tree nodes

    // Print traversals:
    // Preorder: 1 2 4 5 3 6
    // Inorder: 4 2 5 1 3 6
    // Postorder: 4 5 2 6 3 1

    return 0;
}`,
  },
];
