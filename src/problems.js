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
];
