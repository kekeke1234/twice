export const CDICTIONARY = [
  {
    keyword: 'printf',
    category: 'Input/Output',
    en: {
      syntax: 'printf("format string", arg1, arg2, ...);',
      description: 'Formats and prints data to the standard output (console). Returns the number of characters printed, or a negative value on error.',
      example: `printf("Hello, World!\\n");
printf("Value: %d\\n", 42);
printf("Float: %.2f\\n", 3.14159);`,
      parameters: ['format: Format string with specifiers like %d, %s, %f', '...: Values to insert into format specifiers'],
      returns: 'Number of characters printed, or negative value on error',
    },
    ko: {
      syntax: 'printf("형식 문자열", 인자1, 인자2, ...);',
      description: '표준 출력(콘솔)에 데이터를 형식화하여 출력합니다. 출력된 문자 수를 반환하거나, 오류 시 음수를 반환합니다.',
      example: `printf("Hello, World!\\n");
printf("값: %d\\n", 42);
printf("실수: %.2f\\n", 3.14159);`,
      parameters: ['format: %d, %s, %f 같은 지정자가 포함된 형식 문자열', '...: 형식 지정자에 삽입할 값'],
      returns: '출력된 문자 수 또는 오류 시 음수',
    },
    related: ['scanf', 'sprintf', 'fprintf'],
  },
  {
    keyword: 'scanf',
    category: 'Input/Output',
    en: {
      syntax: 'int scanf(const char *format, ...);',
      description: 'Reads formatted data from the standard input (keyboard). Returns the number of items successfully read, or EOF on error.',
      example: `int num;
scanf("%d", &num);

char name[50];
scanf("%s", name);`,
      parameters: ['format: String with format specifiers', '...: Pointers to variables to store input'],
      returns: 'Number of items successfully read, or EOF',
    },
    ko: {
      syntax: 'int scanf(const char *format, ...);',
      description: '표준 입력(키보드)에서 형식화된 데이터를 읽습니다. 성공적으로 읽은 항목 수를 반환하거나, 오류 시 EOF를 반환합니다.',
      example: `int num;
scanf("%d", &num);

char name[50];
scanf("%s", name);`,
      parameters: ['format: 형식 지정자가 포함된 문자열', '...: 입력을 저장할 변수의 포인터'],
      returns: '성공적으로 읽은 항목 수 또는 EOF',
    },
    related: ['printf', 'fscanf', 'sscanf'],
  },
  {
    keyword: 'malloc',
    category: 'Memory Management',
    en: {
      syntax: 'void *malloc(size_t size);',
      description: 'Allocates a block of memory of the specified size in bytes. The memory is uninitialized. Returns a pointer to the allocated memory, or NULL if allocation fails.',
      example: `int *arr = (int*)malloc(5 * sizeof(int));
if (arr == NULL) {
    // Allocation failed
}

// Always free when done
free(arr);`,
      parameters: ['size: Number of bytes to allocate'],
      returns: 'Pointer to allocated memory, or NULL if failed',
    },
    ko: {
      syntax: 'void *malloc(size_t size);',
      description: '지정된 크기(바이트)의 메모리 블록을 할당합니다. 메모리는 초기화되지 않습니다. 할당된 메모리에 대한 포인터를 반환하거나, 할당 실패 시 NULL을 반환합니다.',
      example: `int *arr = (int*)malloc(5 * sizeof(int));
if (arr == NULL) {
    // 할당 실패
}

// 사용 후 반드시 해제
free(arr);`,
      parameters: ['size: 할당할 바이트 수'],
      returns: '할당된 메모리에 대한 포인터 또는 실패 시 NULL',
    },
    related: ['free', 'calloc', 'realloc'],
  },
  {
    keyword: 'free',
    category: 'Memory Management',
    en: {
      syntax: 'void free(void *ptr);',
      description: 'Deallocates the memory previously allocated by malloc(), calloc(), or realloc(). Does nothing if ptr is NULL.',
      example: `int *arr = (int*)malloc(5 * sizeof(int));
// Use arr...
free(arr);
arr = NULL; // Good practice to set to NULL`,
      parameters: ['ptr: Pointer to memory to deallocate'],
      returns: 'None',
    },
    ko: {
      syntax: 'void free(void *ptr);',
      description: '이전에 malloc(), calloc() 또는 realloc()으로 할당된 메모리를 해제합니다. ptr이 NULL이면 아무 작업도 하지 않습니다.',
      example: `int *arr = (int*)malloc(5 * sizeof(int));
// arr 사용...
free(arr);
arr = NULL; // NULL로 설정하는 것이 좋습니다`,
      parameters: ['ptr: 해제할 메모리에 대한 포인터'],
      returns: '없음',
    },
    related: ['malloc', 'calloc', 'realloc'],
  },
  {
    keyword: 'calloc',
    category: 'Memory Management',
    en: {
      syntax: 'void *calloc(size_t nmemb, size_t size);',
      description: 'Allocates memory for an array of nmemb elements of size bytes each. The memory is initialized to zero. Returns a pointer to the allocated memory, or NULL if allocation fails.',
      example: `int *arr = (int*)calloc(5, sizeof(int));
// All elements initialized to 0
free(arr);`,
      parameters: ['nmemb: Number of elements', 'size: Size of each element'],
      returns: 'Pointer to allocated memory, or NULL if failed',
    },
    ko: {
      syntax: 'void *calloc(size_t nmemb, size_t size);',
      description: '각각 size 바이트인 nmemb 개의 요소 배열에 대한 메모리를 할당합니다. 메모리는 0으로 초기화됩니다. 할당된 메모리에 대한 포인터를 반환하거나, 실패 시 NULL을 반환합니다.',
      example: `int *arr = (int*)calloc(5, sizeof(int));
// 모든 요소가 0으로 초기화됩니다
free(arr);`,
      parameters: ['nmemb: 요소의 수', 'size: 각 요소의 크기'],
      returns: '할당된 메모리에 대한 포인터 또는 실패 시 NULL',
    },
    related: ['malloc', 'free', 'realloc'],
  },
  {
    keyword: 'realloc',
    category: 'Memory Management',
    en: {
      syntax: 'void *realloc(void *ptr, size_t size);',
      description: 'Changes the size of the memory block pointed to by ptr. If ptr is NULL, it behaves like malloc(). If size is 0, it behaves like free(). Returns a pointer to the newly allocated memory.',
      example: `int *arr = (int*)malloc(5 * sizeof(int));
arr = (int*)realloc(arr, 10 * sizeof(int));`,
      parameters: ['ptr: Pointer to existing memory block', 'size: New size in bytes'],
      returns: 'Pointer to new memory block, or NULL if failed',
    },
    ko: {
      syntax: 'void *realloc(void *ptr, size_t size);',
      description: 'ptr이 가리키는 메모리 블록의 크기를 변경합니다. ptr이 NULL이면 malloc()처럼 동작합니다. size가 0이면 free()처럼 동작합니다. 새로 할당된 메모리에 대한 포인터를 반환합니다.',
      example: `int *arr = (int*)malloc(5 * sizeof(int));
arr = (int*)realloc(arr, 10 * sizeof(int));`,
      parameters: ['ptr: 기존 메모리 블록에 대한 포인터', 'size: 새로운 크기(바이트)'],
      returns: '새 메모리 블록에 대한 포인터 또는 실패 시 NULL',
    },
    related: ['malloc', 'free', 'calloc'],
  },
  {
    keyword: 'sizeof',
    category: 'Operators',
    en: {
      syntax: 'sizeof(expr) or sizeof(type)',
      description: 'Returns the size in bytes of its operand. When applied to a type, it returns the size of that type. Commonly used with malloc and arrays.',
      example: `int x = sizeof(int);      // 4 on most systems
int arr[10];
int len = sizeof(arr) / sizeof(arr[0]);

int *ptr = malloc(10 * sizeof(int));`,
      parameters: ['expr: Expression or type'],
      returns: 'Size in bytes (size_t)',
    },
    ko: {
      syntax: 'sizeof(식) 또는 sizeof(타입)',
      description: '피연산자의 크기(바이트)를 반환합니다. 타입에 적용하면 해당 타입의 크기를 반환합니다. malloc과 배열에서 자주 사용됩니다.',
      example: `int x = sizeof(int);      // 대부분의 시스템에서 4
int arr[10];
int len = sizeof(arr) / sizeof(arr[0]);

int *ptr = malloc(10 * sizeof(int));`,
      parameters: ['expr: 식 또는 타입'],
      returns: '크기(바이트) (size_t)',
    },
    related: [],
  },
  {
    keyword: 'typedef',
    category: 'Types',
    en: {
      syntax: 'typedef existing_type new_name;',
      description: 'Creates an alias (new name) for an existing type. Commonly used to create shorter or more meaningful type names.',
      example: `typedef unsigned int uint;
typedef struct Node Node;

uint age = 25;
Node *head;`,
      parameters: ['existing_type: The original type name', 'new_name: The alias to create'],
      returns: 'None',
    },
    ko: {
      syntax: 'typedef 기존타입 새이름;',
      description: '기존 타입에 대한 별칭(새 이름)을 생성합니다. 더 짧거나 의미 있는 타입 이름을 만들 때 자주 사용됩니다.',
      example: `typedef unsigned int uint;
typedef struct Node Node;

uint age = 25;
Node *head;`,
      parameters: ['existing_type: 원본 타입 이름', 'new_name: 생성할 별칭'],
      returns: '없음',
    },
    related: ['struct'],
  },
  {
    keyword: 'struct',
    category: 'Types',
    en: {
      syntax: 'struct tag { members };',
      description: 'Defines a structured data type that groups together variables of different types. The variables in a struct are called members.',
      example: `struct Student {
    char name[50];
    int age;
    float gpa;
};

struct Student s = {"Kim", 20, 3.8};
printf("%s", s.name);`,
      parameters: ['tag: Optional name for the struct', 'members: Variable declarations'],
      returns: 'None',
    },
    ko: {
      syntax: 'struct 태그 { 멤버들 };',
      description: '다른 타입의 변수들을 그룹화하는 구조화된 데이터 타입을 정의합니다. struct의 변수를 멤버라고 합니다.',
      example: `struct Student {
    char name[50];
    int age;
    float gpa;
};

struct Student s = {"Kim", 20, 3.8};
printf("%s", s.name);`,
      parameters: ['tag: struct의 선택적 이름', 'members: 변수 선언'],
      returns: '없음',
    },
    related: ['typedef', 'union', 'sizeof'],
  },
  {
    keyword: 'union',
    category: 'Types',
    en: {
      syntax: 'union tag { members };',
      description: 'A special data type where all members share the same memory location. The size of a union is the size of its largest member.',
      example: `union Data {
    int i;
    float f;
    char str[20];
};

union Data data;
data.i = 10;  // Overwrites other members`,
      parameters: ['tag: Optional name for the union', 'members: Variable declarations'],
      returns: 'None',
    },
    ko: {
      syntax: 'union 태그 { 멤버들 };',
      description: '모든 멤버가 같은 메모리 위치를 공유하는 특수 데이터 타입입니다. union의 크기는 가장 큰 멤버의 크기입니다.',
      example: `union Data {
    int i;
    float f;
    char str[20];
};

union Data data;
data.i = 10;  // 다른 멤버들을 덮어씁니다`,
      parameters: ['tag: union의 선택적 이름', 'members: 변수 선언'],
      returns: '없음',
    },
    related: ['struct'],
  },
  {
    keyword: 'enum',
    category: 'Types',
    en: {
      syntax: 'enum tag { enumerators };',
      description: 'Defines a set of named integer constants. By default, enumerators start at 0 and increment by 1.',
      example: `enum Day { MON, TUE, WED, THU, FRI, SAT, SUN };

enum Day today = WED;
printf("%d", today);  // Prints 2`,
      parameters: ['tag: Optional name for the enum', 'enumerators: List of named constants'],
      returns: 'None',
    },
    ko: {
      syntax: 'enum 태그 { 열거자들 };',
      description: '명명된 정수 상수들의 집합을 정의합니다. 기본적으로 열거자는 0부터 시작하여 1씩 증가합니다.',
      example: `enum Day { MON, TUE, WED, THU, FRI, SAT, SUN };

enum Day today = WED;
printf("%d", today);  // 2를 출력합니다`,
      parameters: ['tag: enum의 선택적 이름', 'enumerators: 명명된 상수들의 목록'],
      returns: '없음',
    },
    related: ['typedef', 'const'],
  },
  {
    keyword: 'if',
    category: 'Control Flow',
    en: {
      syntax: 'if (condition) { statements }',
      description: 'Executes the statements inside the block if the condition is true (non-zero). Otherwise, the statements are skipped.',
      example: `if (x > 0) {
    printf("Positive");
}

if (score >= 60) {
    printf("Pass");
} else {
    printf("Fail");
}`,
      parameters: ['condition: Expression that evaluates to true or false'],
      returns: 'None',
    },
    ko: {
      syntax: 'if (조건) { 문장들 }',
      description: '조건이 참(0이 아닌 경우)이면 블록 안의 문장들을 실행합니다. 그렇지 않으면 문장들이 건너뜁니다.',
      example: `if (x > 0) {
    printf("양수");
}

if (score >= 60) {
    printf("합격");
} else {
    printf("불합격");
}`,
      parameters: ['condition: 참 또는 거짓으로 평가되는 식'],
      returns: '없음',
    },
    related: ['else', 'switch'],
  },
  {
    keyword: 'else',
    category: 'Control Flow',
    en: {
      syntax: 'else { statements } or else if (condition) { statements }',
      description: 'Used with if statement. Executes when the if condition is false. Can be chained with else if for multiple conditions.',
      example: `if (x > 0) {
    printf("Positive");
} else if (x < 0) {
    printf("Negative");
} else {
    printf("Zero");
}`,
      parameters: [],
      returns: 'None',
    },
    ko: {
      syntax: 'else { 문장들 } 또는 else if (조건) { 문장들 }',
      description: 'if 문과 함께 사용됩니다. if 조건이 거짓일 때 실행됩니다. 여러 조건에는 else if로 연결할 수 있습니다.',
      example: `if (x > 0) {
    printf("양수");
} else if (x < 0) {
    printf("음수");
} else {
    printf("零");
}`,
      parameters: [],
      returns: '없음',
    },
    related: ['if', 'switch'],
  },
  {
    keyword: 'switch',
    category: 'Control Flow',
    en: {
      syntax: 'switch (expression) { case value: statements; break; ... }',
      description: 'Tests the value of an expression against a list of case values. Executes matching case. Use break to prevent fall-through.',
      example: `switch (day) {
    case 1:
        printf("Monday");
        break;
    case 2:
        printf("Tuesday");
        break;
    default:
        printf("Invalid");
}`,
      parameters: ['expression: Integer or character expression'],
      returns: 'None',
    },
    ko: {
      syntax: 'switch (식) { case 값: 문장들; break; ... }',
      description: '식의 값을 case 값 목록과 비교합니다. 일치하는 case를 실행합니다. 통과를 방지하려면 break를 사용하세요.',
      example: `switch (day) {
    case 1:
        printf("월요일");
        break;
    case 2:
        printf("화요일");
        break;
    default:
        printf("유효하지 않음");
}`,
      parameters: ['expression: 정수 또는 문자 식'],
      returns: '없음',
    },
    related: ['if', 'break', 'case'],
  },
  {
    keyword: 'for',
    category: 'Control Flow',
    en: {
      syntax: 'for (init; condition; increment) { statements }',
      description: 'A loop construct with three parts: initialization (run once), condition (tested each iteration), and increment (run after each iteration).',
      example: `for (int i = 0; i < 10; i++) {
    printf("%d ", i);
}

for (int i = 0, j = 10; i < j; i++, j--) {
    printf("%d %d ", i, j);
}`,
      parameters: ['init: Initialization expression', 'condition: Loop condition', 'increment: Increment expression'],
      returns: 'None',
    },
    ko: {
      syntax: 'for (초기화; 조건; 증가) { 문장들 }',
      description: '세 부분으로 구성된 루프 구조: 초기화(한 번 실행), 조건(각 반복마다 테스트), 증가(각 반복 후 실행).',
      example: `for (int i = 0; i < 10; i++) {
    printf("%d ", i);
}

for (int i = 0, j = 10; i < j; i++, j--) {
    printf("%d %d ", i, j);
}`,
      parameters: ['init: 초기화 식', 'condition: 루프 조건', 'increment: 증가 식'],
      returns: '없음',
    },
    related: ['while', 'do', 'break'],
  },
  {
    keyword: 'while',
    category: 'Control Flow',
    en: {
      syntax: 'while (condition) { statements }',
      description: 'A loop that repeats while the condition is true. The condition is evaluated before each iteration.',
      example: `int i = 0;
while (i < 10) {
    printf("%d ", i);
    i++;
}`,
      parameters: ['condition: Loop condition (tested before each iteration)'],
      returns: 'None',
    },
    ko: {
      syntax: 'while (조건) { 문장들 }',
      description: '조건이 참인 동안 반복하는 루프입니다. 각 반복 전에 조건이 평가됩니다.',
      example: `int i = 0;
while (i < 10) {
    printf("%d ", i);
    i++;
}`,
      parameters: ['condition: 루프 조건 (각 반복 전에 테스트)'],
      returns: '없음',
    },
    related: ['for', 'do', 'break'],
  },
  {
    keyword: 'do',
    category: 'Control Flow',
    en: {
      syntax: 'do { statements } while (condition);',
      description: 'A loop that executes the statements first, then tests the condition. The loop body always executes at least once.',
      example: `int i = 0;
do {
    printf("%d ", i);
    i++;
} while (i < 10);`,
      parameters: ['condition: Loop condition (tested after each iteration)'],
      returns: 'None',
    },
    ko: {
      syntax: 'do { 문장들 } while (조건);',
      description: '먼저 문장들을 실행한 다음 조건을 테스트하는 루프입니다. 루프 본문이 항상 최소 한 번은 실행됩니다.',
      example: `int i = 0;
do {
    printf("%d ", i);
    i++;
} while (i < 10);`,
      parameters: ['condition: 루프 조건 (각 반복 후에 테스트)'],
      returns: '없음',
    },
    related: ['while', 'for', 'break'],
  },
  {
    keyword: 'break',
    category: 'Control Flow',
    en: {
      syntax: 'break;',
      description: 'Exits the innermost loop (for, while, do) or switch statement immediately.',
      example: `for (int i = 0; i < 10; i++) {
    if (i == 5) {
        break;  // Exit loop when i is 5
    }
    printf("%d ", i);
}`,
      parameters: [],
      returns: 'None',
    },
    ko: {
      syntax: 'break;',
      description: '가장 안쪽의 루프(for, while, do) 또는 switch 문을 즉시 종료합니다.',
      example: `for (int i = 0; i < 10; i++) {
    if (i == 5) {
        break;  // i가 5일 때 루프 종료
    }
    printf("%d ", i);
}`,
      parameters: [],
      returns: '없음',
    },
    related: ['continue', 'for', 'while', 'switch'],
  },
  {
    keyword: 'continue',
    category: 'Control Flow',
    en: {
      syntax: 'continue;',
      description: 'Skips the rest of the current loop iteration and proceeds to the next iteration.',
      example: `for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) {
        continue;  // Skip even numbers
    }
    printf("%d ", i);  // Prints 1, 3, 5, 7, 9
}`,
      parameters: [],
      returns: 'None',
    },
    ko: {
      syntax: 'continue;',
      description: '현재 루프 반복의 나머지를 건너뛰고 다음 반복으로 진행합니다.',
      example: `for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) {
        continue;  // 짝수 건너뛰기
    }
    printf("%d ", i);  // 1, 3, 5, 7, 9를 출력
}`,
      parameters: [],
      returns: '없음',
    },
    related: ['break', 'for', 'while'],
  },
  {
    keyword: 'return',
    category: 'Functions',
    en: {
      syntax: 'return expression;',
      description: 'Exits a function and optionally returns a value to the caller. If the function returns void, use return without a value.',
      example: `int square(int x) {
    return x * x;
}

void printHello(void) {
    printf("Hello");
    return;  // Optional in void functions
}`,
      parameters: ['expression: Value to return (optional for void functions)'],
      returns: 'The value to the caller',
    },
    ko: {
      syntax: 'return 식;',
      description: '함수를 종료하고 선택적으로 호출자에게 값을 반환합니다. 함수가 void를 반환하면 값 없이 return을 사용하세요.',
      example: `int square(int x) {
    return x * x;
}

void printHello(void) {
    printf("Hello");
    return;  // void 함수에서는 선택적
}`,
      parameters: ['expression: 반환할 값 (void 함수에서는 선택적)'],
      returns: '호출자에게 값 반환',
    },
    related: ['void', 'function'],
  },
  {
    keyword: 'void',
    category: 'Types',
    en: {
      syntax: 'void type_name; or void function_name(void);',
      description: 'An incomplete type that represents the absence of a type. Used to indicate that a function does not return a value or takes no parameters.',
      example: `void printMessage(void) {
    printf("Hello");
}

int getValue(void) {
    return 42;
}`,
      parameters: [],
      returns: 'None',
    },
    ko: {
      syntax: 'void 타입이름; 또는 void 함수이름(void);',
      description: '타입의 부재를 나타내는 불완전한 타입입니다. 함수가 값을 반환하지 않거나 매개변수를 받지 않음을 나타내는 데 사용됩니다.',
      example: `void printMessage(void) {
    printf("Hello");
}

int getValue(void) {
    return 42;
}`,
      parameters: [],
      returns: '없음',
    },
    related: ['return', 'function'],
  },
  {
    keyword: 'const',
    category: 'Qualifiers',
    en: {
      syntax: 'const type name = value;',
      description: 'A type qualifier that specifies that a variable\'s value cannot be changed after initialization.',
      example: `const int MAX = 100;
const char *message = "Hello";

void func(const int *ptr) {
    // Cannot modify *ptr
}`,
      parameters: [],
      returns: 'None',
    },
    ko: {
      syntax: 'const 타입 이름 = 값;',
      description: '변수의 값이 초기화 후 변경할 수 없도록 지정하는 타입 한정자입니다.',
      example: `const int MAX = 100;
const char *message = "Hello";

void func(const int *ptr) {
    // *ptr을 수정할 수 없음
}`,
      parameters: [],
      returns: '없음',
    },
    related: ['static', 'volatile'],
  },
  {
    keyword: 'static',
    category: 'Storage Classes',
    en: {
      syntax: 'static type name;',
      description: 'A storage class specifier. Static variables retain their value between function calls. Static functions are only visible within their file.',
      example: `void counter(void) {
    static int count = 0;  // Retains value
    count++;
    printf("Count: %d", count);
}`,
      parameters: [],
      returns: 'None',
    },
    ko: {
      syntax: 'static 타입 이름;',
      description: '스토리지 클래스 지정자입니다. 정적 변수는 함수 호출 사이에 값을 유지합니다. 정적 함수는 해당 파일 내에서만 볼 수 있습니다.',
      example: `void counter(void) {
    static int count = 0;  // 값 유지
    count++;
    printf("Count: %d", count);
}`,
      parameters: [],
      returns: '없음',
    },
    related: ['extern', 'register'],
  },
  {
    keyword: 'extern',
    category: 'Storage Classes',
    en: {
      syntax: 'extern type name;',
      description: 'Declares a variable or function defined elsewhere (usually in another file). Used to access global variables across files.',
      example: `// In file1.c
int global_var = 10;

// In file2.c
extern int global_var;
printf("%d", global_var);  // Prints 10`,
      parameters: [],
      returns: 'None',
    },
    ko: {
      syntax: 'extern 타입 이름;',
      description: '다른 곳(일반적으로 다른 파일)에서 정의된 변수 또는 함수를 선언합니다. 파일 간 전역 변수에 접근하는 데 사용됩니다.',
      example: `// file1.c에서
int global_var = 10;

// file2.c에서
extern int global_var;
printf("%d", global_var);  // 10을 출력`,
      parameters: [],
      returns: '없음',
    },
    related: ['static', 'global'],
  },
  {
    keyword: 'pointer',
    category: 'Pointers',
    en: {
      syntax: 'type *name;',
      description: 'A variable that stores the memory address of another variable. Use * to declare a pointer, & to get address, and * to dereference.',
      example: `int num = 42;
int *ptr = &num;

printf("%d", *ptr);   // Value: 42
printf("%p", ptr);    // Address

*ptr = 100;           // Modify value through pointer`,
      parameters: ['type: Type of the pointed-to variable'],
      returns: 'None',
    },
    ko: {
      syntax: '타입 *이름;',
      description: '다른 변수의 메모리 주소를 저장하는 변수입니다. 포인터 선언에는 *를 사용하고, 주소를 가져오려면 &를 사용하며, 역참조에는 *를 사용합니다.',
      example: `int num = 42;
int *ptr = &num;

printf("%d", *ptr);   // 값: 42
printf("%p", ptr);    // 주소

*ptr = 100;           // 포인터를 통해 값 수정`,
      parameters: ['type: 가리키는 변수의 타입'],
      returns: '없음',
    },
    related: ['&', '*', 'array'],
  },
  {
    keyword: 'array',
    category: 'Data Structures',
    en: {
      syntax: 'type name[size]; or type name[] = {values};',
      description: 'A contiguous collection of elements of the same type. Arrays are fixed-size in C. Use malloc for dynamic arrays.',
      example: `int arr[5] = {1, 2, 3, 4, 5};
int arr2[] = {10, 20, 30};

for (int i = 0; i < 5; i++) {
    printf("%d ", arr[i]);
}`,
      parameters: ['type: Element type', 'size: Number of elements (optional when initializing)'],
      returns: 'None',
    },
    ko: {
      syntax: '타입 이름[크기]; 또는 타입 이름[] = {값들};',
      description: '같은 타입의 요소들의 연속적인 컬렉션입니다. C에서 배열은 고정 크기입니다. 동적 배열에는 malloc을 사용하세요.',
      example: `int arr[5] = {1, 2, 3, 4, 5};
int arr2[] = {10, 20, 30};

for (int i = 0; i < 5; i++) {
    printf("%d ", arr[i]);
}`,
      parameters: ['type: 요소 타입', 'size: 요소 수 (초기화 시 선택적)'],
      returns: '없음',
    },
    related: ['pointer', 'sizeof', 'malloc'],
  },
  {
    keyword: 'string',
    category: 'Data Structures',
    en: {
      syntax: 'char name[] = "text"; or char *name = "text";',
      description: 'In C, strings are arrays of characters terminated by a null character (\0). Use string.h functions for manipulation.',
      example: `char str1[] = "Hello";
char *str2 = "World";

printf("%s", str1);
printf("%lu", strlen(str1));
strcpy(str1, "Hi");
strcat(str1, " there");`,
      parameters: [],
      returns: 'None',
    },
    ko: {
      syntax: 'char 이름[] = "텍스트"; 또는 char *이름 = "텍스트";',
      description: 'C에서 문자열은 널 문자(\0)로 종료되는 문자 배열입니다. 조작에는 string.h 함수를 사용하세요.',
      example: `char str1[] = "Hello";
char *str2 = "World";

printf("%s", str1);
printf("%lu", strlen(str1));
strcpy(str1, "Hi");
strcat(str1, " there");`,
      parameters: [],
      returns: '없음',
    },
    related: ['char', 'string.h', 'printf'],
  },
  {
    keyword: 'fopen',
    category: 'File I/O',
    en: {
      syntax: 'FILE *fopen(const char *filename, const char *mode);',
      description: 'Opens a file and returns a FILE pointer. Returns NULL if the file cannot be opened.',
      example: `FILE *fp = fopen("data.txt", "r");
if (fp == NULL) {
    printf("Cannot open file");
} else {
    // Read from file
    fclose(fp);
}`,
      parameters: ['filename: Path to file', 'mode: "r" (read), "w" (write), "a" (append), etc.'],
      returns: 'FILE pointer, or NULL if failed',
    },
    ko: {
      syntax: 'FILE *fopen(const char *filename, const char *mode);',
      description: '파일을 열고 FILE 포인터를 반환합니다. 파일을 열 수 없으면 NULL을 반환합니다.',
      example: `FILE *fp = fopen("data.txt", "r");
if (fp == NULL) {
    printf("파일을 열 수 없습니다");
} else {
    // 파일에서 읽기
    fclose(fp);
}`,
      parameters: ['filename: 파일 경로', 'mode: "r" (읽기), "w" (쓰기), "a" (추가) 등'],
      returns: 'FILE 포인터 또는 실패 시 NULL',
    },
    related: ['fclose', 'fread', 'fwrite'],
  },
  {
    keyword: 'fclose',
    category: 'File I/O',
    en: {
      syntax: 'int fclose(FILE *stream);',
      description: 'Closes a file opened with fopen(). Flushes any buffered data. Returns 0 on success, or EOF on error.',
      example: `FILE *fp = fopen("data.txt", "w");
fprintf(fp, "Hello");
fclose(fp);`,
      parameters: ['stream: FILE pointer to close'],
      returns: '0 on success, EOF on error',
    },
    ko: {
      syntax: 'int fclose(FILE *stream);',
      description: 'fopen()으로 열린 파일을 닫습니다. 버퍼링된 모든 데이터를 플러시합니다. 성공 시 0을 반환하고, 오류 시 EOF를 반환합니다.',
      example: `FILE *fp = fopen("data.txt", "w");
fprintf(fp, "Hello");
fclose(fp);`,
      parameters: ['stream: 닫을 FILE 포인터'],
      returns: '성공 시 0, 오류 시 EOF',
    },
    related: ['fopen', 'fprintf', 'fscanf'],
  },
  {
    keyword: 'fprintf',
    category: 'File I/O',
    en: {
      syntax: 'int fprintf(FILE *stream, const char *format, ...);',
      description: 'Formatted output to a file. Similar to printf but writes to the specified file stream.',
      example: `FILE *fp = fopen("data.txt", "w");
fprintf(fp, "Name: %s, Age: %d", "Kim", 20);
fclose(fp);`,
      parameters: ['stream: FILE pointer', 'format: Format string', '...: Arguments'],
      returns: 'Number of characters written, or negative on error',
    },
    ko: {
      syntax: 'int fprintf(FILE *stream, const char *format, ...);',
      description: '파일에 형식화된 출력을 합니다. printf와 유사하지만 지정된 파일 스트림에 씁니다.',
      example: `FILE *fp = fopen("data.txt", "w");
fprintf(fp, "이름: %s, 나이: %d", "Kim", 20);
fclose(fp);`,
      parameters: ['stream: FILE 포인터', 'format: 형식 문자열', '...: 인자'],
      returns: '쓰여진 문자 수 또는 오류 시 음수',
    },
    related: ['fscanf', 'printf', 'fopen'],
  },
  {
    keyword: 'fscanf',
    category: 'File I/O',
    en: {
      syntax: 'int fscanf(FILE *stream, const char *format, ...);',
      description: 'Formatted input from a file. Similar to scanf but reads from the specified file stream.',
      example: `FILE *fp = fopen("data.txt", "r");
fscanf(fp, "%s %d", name, &age);
fclose(fp);`,
      parameters: ['stream: FILE pointer', 'format: Format string', '...: Pointers to store values'],
      returns: 'Number of items successfully read',
    },
    ko: {
      syntax: 'int fscanf(FILE *stream, const char *format, ...);',
      description: '파일에서 형식화된 입력을 합니다. scanf와 유사하지만 지정된 파일 스트림에서 읽습니다.',
      example: `FILE *fp = fopen("data.txt", "r");
fscanf(fp, "%s %d", name, &age);
fclose(fp);`,
      parameters: ['stream: FILE 포인터', 'format: 형식 문자열', '...: 값을 저장할 포인터'],
      returns: '성공적으로 읽은 항목 수',
    },
    related: ['fprintf', 'scanf', 'fopen'],
  },
  {
    keyword: 'strlen',
    category: 'String Functions',
    en: {
      syntax: 'size_t strlen(const char *s);',
      description: 'Returns the length of a string (number of characters before the null terminator).',
      example: `char str[] = "Hello";
printf("%lu", strlen(str));  // Prints 5`,
      parameters: ['s: Null-terminated string'],
      returns: 'Length of string',
    },
    ko: {
      syntax: 'size_t strlen(const char *s);',
      description: '문자열의 길이를 반환합니다(널 종단 자之前的 문자 수).',
      example: `char str[] = "Hello";
printf("%lu", strlen(str));  // 5를 출력`,
      parameters: ['s: 널 종단 문자열'],
      returns: '문자열의 길이',
    },
    related: ['strcpy', 'strcat', 'strcmp'],
  },
  {
    keyword: 'strcpy',
    category: 'String Functions',
    en: {
      syntax: 'char *strcpy(char *dest, const char *src);',
      description: 'Copies the string src to dest (including the null terminator). Returns dest. Use strncpy for safer copying.',
      example: `char src[] = "Hello";
char dest[20];
strcpy(dest, src);
printf("%s", dest);  // Prints Hello`,
      parameters: ['dest: Destination string', 'src: Source string'],
      returns: 'Pointer to dest',
    },
    ko: {
      syntax: 'char *strcpy(char *dest, const char *src);',
      description: 'src 문자열을 dest로 복사합니다(널 종단 문자 포함). dest를 반환합니다. 더 안전한 복사에는 strncpy를 사용하세요.',
      example: `char src[] = "Hello";
char dest[20];
strcpy(dest, src);
printf("%s", dest);  // Hello를 출력`,
      parameters: ['dest: 대상 문자열', 'src: 소스 문자열'],
      returns: 'dest에 대한 포인터',
    },
    related: ['strncpy', 'strcat', 'strlen'],
  },
  {
    keyword: 'strcat',
    category: 'String Functions',
    en: {
      syntax: 'char *strcat(char *dest, const char *src);',
      description: 'Appends the src string to the dest string (overwriting the null terminator of dest). Returns dest.',
      example: `char dest[20] = "Hello";
char src[] = " World";
strcat(dest, src);
printf("%s", dest);  // Prints Hello World`,
      parameters: ['dest: Destination string (must have enough space)', 'src: Source string'],
      returns: 'Pointer to dest',
    },
    ko: {
      syntax: 'char *strcat(char *dest, const char *src);',
      description: 'src 문자열을 dest 문자열에 추가합니다(dest의 널 종단 문자를 덮어씀). dest를 반환합니다.',
      example: `char dest[20] = "Hello";
char src[] = " World";
strcat(dest, src);
printf("%s", dest);  // Hello World를 출력`,
      parameters: ['dest: 대상 문자열 (충분한 공간이 있어야 함)', 'src: 소스 문자열'],
      returns: 'dest에 대한 포인터',
    },
    related: ['strcpy', 'strncat', 'strlen'],
  },
  {
    keyword: 'strcmp',
    category: 'String Functions',
    en: {
      syntax: 'int strcmp(const char *s1, const char *s2);',
      description: 'Compares two strings lexicographically. Returns 0 if equal, negative if s1 < s2, positive if s1 > s2.',
      example: `if (strcmp(str1, str2) == 0) {
    printf("Strings are equal");
} else {
    printf("Strings are different");
}`,
      parameters: ['s1: First string', 's2: Second string'],
      returns: '0 if equal, <0 if s1 < s2, >0 if s1 > s2',
    },
    ko: {
      syntax: 'int strcmp(const char *s1, const char *s2);',
      description: '두 문자열을 사전적으로 비교합니다. 같으면 0, s1 < s2이면 음수, s1 > s2이면 양수를 반환합니다.',
      example: `if (strcmp(str1, str2) == 0) {
    printf("문자열이 같습니다");
} else {
    printf("문자열이 다릅니다");
}`,
      parameters: ['s1: 첫 번째 문자열', 's2: 두 번째 문자열'],
      returns: '같으면 0, s1 < s2이면 음수, s1 > s2이면 양수',
    },
    related: ['strncmp', 'strcpy', 'strlen'],
  },
  {
    keyword: 'main',
    category: 'Functions',
    en: {
      syntax: 'int main(void); or int main(int argc, char *argv[]);',
      description: 'The entry point of a C program. Called by the runtime before any other function. Returns program exit status.',
      example: `int main(void) {
    printf("Hello, World!");
    return 0;
}

int main(int argc, char *argv[]) {
    for (int i = 0; i < argc; i++) {
        printf("%s\\n", argv[i]);
    }
    return 0;
}`,
      parameters: ['argc: Argument count', 'argv: Argument values'],
      returns: 'Program exit status (0 for success)',
    },
    ko: {
      syntax: 'int main(void); 또는 int main(int argc, char *argv[]);',
      description: 'C 프로그램의 진입점입니다. 다른 함수보다 먼저 런타임에 의해 호출됩니다. 프로그램 종료 상태를 반환합니다.',
      example: `int main(void) {
    printf("Hello, World!");
    return 0;
}

int main(int argc, char *argv[]) {
    for (int i = 0; i < argc; i++) {
        printf("%s\\n", argv[i]);
    }
    return 0;
}`,
      parameters: ['argc: 인자 개수', 'argv: 인자 값'],
      returns: '프로그램 종료 상태 (성공 시 0)',
    },
    related: ['return', 'printf'],
  },
  {
    keyword: '#include',
    category: 'Preprocessor',
    en: {
      syntax: '#include <header> or #include "file"',
      description: 'Preprocessor directive that includes the contents of another file. Use <> for system headers, "" for local files.',
      example: `#include <stdio.h>
#include <stdlib.h>
#include "myheader.h"`,
      parameters: ['header/file: Path to the file to include'],
      returns: 'None',
    },
    ko: {
      syntax: '#include <헤더> 또는 #include "파일"',
      description: '다른 파일의 내용을 포함하는 전처리기 지시문입니다. 시스템 헤더에는 <>를 사용하고, 로컬 파일에는 ""를 사용하세요.',
      example: `#include <stdio.h>
#include <stdlib.h>
#include "myheader.h"`,
      parameters: ['header/file: 포함할 파일 경로'],
      returns: '없음',
    },
    related: ['define', 'ifdef'],
  },
  {
    keyword: '#define',
    category: 'Preprocessor',
    en: {
      syntax: '#define NAME value or #define MACRO(args) expression',
      description: 'Preprocessor directive that defines a macro or constant. Macros are replaced before compilation.',
      example: `#define MAX_SIZE 100
#define SQUARE(x) ((x) * (x))
#define PI 3.14159`,
      parameters: ['NAME/MACRO: Identifier to define', 'value/expression: Replacement value'],
      returns: 'None',
    },
    ko: {
      syntax: '#define 이름 값 또는 #define 매크로(인자) 식',
      description: '매크로 또는 상수를 정의하는 전처리기 지시문입니다. 매크로는 컴파일 전에 대체됩니다.',
      example: `#define MAX_SIZE 100
#define SQUARE(x) ((x) * (x))
#define PI 3.14159`,
      parameters: ['NAME/MACRO: 정의할 식별자', 'value/expression: 대체 값'],
      returns: '없음',
    },
    related: ['include', 'ifdef'],
  },
  {
    keyword: '#ifdef',
    category: 'Preprocessor',
    en: {
      syntax: '#ifdef MACRO or #ifndef MACRO',
      description: 'Conditional compilation directives. #ifdef executes if MACRO is defined. #ifndef executes if MACRO is NOT defined.',
      example: `#ifdef DEBUG
    printf("Debug mode");
#endif

#ifndef MAX_SIZE
    #define MAX_SIZE 100
#endif`,
      parameters: ['MACRO: Name of macro to check'],
      returns: 'None',
    },
    ko: {
      syntax: '#ifdef 매크로 또는 #ifndef 매크로',
      description: '조건부 컴파일 지시문입니다. #ifdef는 매크로가 정의되어 있으면 실행합니다. #ifndef는 매크로가 정의되어 있지 않으면 실행합니다.',
      example: `#ifdef DEBUG
    printf("디버그 모드");
#endif

#ifndef MAX_SIZE
    #define MAX_SIZE 100
#endif`,
      parameters: ['MACRO: 확인할 매크로 이름'],
      returns: '없음',
    },
    related: ['define', 'if'],
  },
  {
    keyword: 'function',
    category: 'Functions',
    en: {
      syntax: 'return_type name(parameters) { statements }',
      description: 'A reusable block of code that performs a specific task. Functions help organize code and avoid repetition.',
      example: `int add(int a, int b) {
    return a + b;
}

void greet(char *name) {
    printf("Hello, %s!", name);
}`,
      parameters: ['return_type: Type of value returned', 'name: Function name', 'parameters: Input parameters'],
      returns: 'Value specified by return_type, or nothing if void',
    },
    ko: {
      syntax: '반환타입 이름(매개변수) { 문장들 }',
      description: '특정 작업을 수행하는 재사용 가능한 코드 블록입니다. 함수는 코드를 구성하고 반복을 피하는 데 도움이 됩니다.',
      example: `int add(int a, int b) {
    return a + b;
}

void greet(char *name) {
    printf("Hello, %s!", name);
}`,
      parameters: ['return_type: 반환값의 타입', 'name: 함수 이름', 'parameters: 입력 매개변수'],
      returns: 'return_type로 지정된 값, 또는 void이면 없음',
    },
    related: ['return', 'void', 'main'],
  },
  {
    keyword: 'recursion',
    category: 'Functions',
    en: {
      syntax: 'function calls itself with base case',
      description: 'A technique where a function calls itself to solve a problem by breaking it into smaller subproblems.',
      example: `int factorial(int n) {
    if (n <= 1) return 1;        // Base case
    return n * factorial(n - 1);  // Recursive call
}

// fibonacci: 1, 1, 2, 3, 5, 8, ...
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,
      parameters: ['n: Problem size (decreases with each call)'],
      returns: 'Computed result',
    },
    ko: {
      syntax: '함수가 기본 케이스로 자신을 호출',
      description: '문제를 더 작은 하위 문제로 나누어 해결하기 위해 함수가 자신을 호출하는 기술입니다.',
      example: `int factorial(int n) {
    if (n <= 1) return 1;        // 기본 케이스
    return n * factorial(n - 1);  // 재귀 호출
}

// 피보나치: 1, 1, 2, 3, 5, 8, ...
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,
      parameters: ['n: 문제 크기 (각 호출마다 감소)'],
      returns: '계산된 결과',
    },
    related: ['return', 'function', 'while'],
  },
  {
    keyword: 'NULL',
    category: 'Pointers',
    en: {
      syntax: 'NULL',
      description: 'A macro that represents a null pointer constant. Used to indicate that a pointer does not point to any valid memory location.',
      example: `int *ptr = NULL;
if (ptr == NULL) {
    printf("Pointer is not valid");
}

// After freeing memory
free(ptr);
ptr = NULL;  // Good practice`,
      parameters: [],
      returns: 'None',
    },
    ko: {
      syntax: 'NULL',
      description: 'null 포인터 상수를 나타내는 매크로입니다. 포인터가 유효한 메모리 위치를 가리키지 않음을 나타내는 데 사용됩니다.',
      example: `int *ptr = NULL;
if (ptr == NULL) {
    printf("포인터가 유효하지 않습니다");
}

// 메모리 해제 후
free(ptr);
ptr = NULL;  // 좋은 습관`,
      parameters: [],
      returns: '없음',
    },
    related: ['pointer', 'malloc', 'free'],
  },
  {
    keyword: '&',
    category: 'Operators',
    en: {
      syntax: '&variable',
      description: 'The address-of operator returns the memory address of a variable. Used to initialize pointers or pass addresses to functions.',
      example: `int num = 42;
int *ptr = &num;  // ptr holds address of num

printf("%p", ptr);   // Print address
printf("%d", *ptr);  // Print value at that address`,
      parameters: ['variable: Variable to get address of'],
      returns: 'Memory address of the variable',
    },
    ko: {
      syntax: '&변수',
      description: '주소 연산자는 변수의 메모리 주소를 반환합니다. 포인터를 초기화하거나 함수에 주소를 전달하는 데 사용됩니다.',
      example: `int num = 42;
int *ptr = &num;  // ptr은 num의 주소를 저장

printf("%p", ptr);   // 주소 출력
printf("%d", *ptr);  // 해당 주소의 값 출력`,
      parameters: ['variable: 주소를 가져올 변수'],
      returns: '변수의 메모리 주소',
    },
    related: ['pointer', '*', 'NULL'],
  },
  {
    keyword: '*',
    category: 'Operators',
    en: {
      syntax: '*pointer or *type',
      description: 'The dereference operator accesses the value at the address a pointer points to. Also used in type casting and multiplication.',
      example: `int num = 42;
int *ptr = &num;

printf("%d", *ptr);  // Value at ptr: 42
*ptr = 100;          // Modify value through pointer`,
      parameters: ['pointer: Pointer to dereference'],
      returns: 'Value at the pointer address',
    },
    ko: {
      syntax: '*포인터 또는 *타입',
      description: '역참조 연산자는 포인터가 가리키는 주소의 값에 접근합니다. 타입 캐스팅과 곱셈에도 사용됩니다.',
      example: `int num = 42;
int *ptr = &num;

printf("%d", *ptr);  // ptr의 값: 42
*ptr = 100;          // 포인터를 통해 값 수정`,
      parameters: ['pointer: 역참조할 포인터'],
      returns: '포인터 주소의 값',
    },
    related: ['&', 'pointer', 'malloc'],
  },
];

export const CATEGORIES = [
  'All',
  'Input/Output',
  'Memory Management',
  'Operators',
  'Types',
  'Control Flow',
  'Functions',
  'Pointers',
  'Data Structures',
  'File I/O',
  'String Functions',
  'Preprocessor',
  'Storage Classes',
  'Qualifiers',
];

export const CATEGORIES_KO = [
  '전체',
  '입출력',
  '메모리 관리',
  '연산자',
  '타입',
  '제어 흐름',
  '함수',
  '포인터',
  '데이터 구조',
  '파일 입출력',
  '문자열 함수',
  '전처리기',
  '스토리지 클래스',
  '한정자',
];