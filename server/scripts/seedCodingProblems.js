const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const CodingProblem = require('../models/CodingProblem');

const problems = [
  {
    title: 'Hello, Floyd Coder!',
    slug: 'hello-floyd-coder',
    difficulty: 'Beginner',
    category: 'Variables',
    order: 1,
    points: 50,
    description: 'Welcome to your first Floyd School coding lab challenge! Your mission is to print the exact welcome greeting to the console:\n\nHello, Floyd Coder!',
    inputFormat: 'No input required.',
    outputFormat: 'Print Hello, Floyd Coder! (without quotes).',
    constraints: 'Output must match exact casing and punctuation.',
    starterTemplates: {
      python: '# Write your code below to print the greeting\nprint(Hello, Floyd Coder!)\n',
      javascript: '// Write your code below to log the greeting\nconsole.log(Hello, Floyd Coder!);\n',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << Hello, Floyd Coder! << endl;\n    return 0;\n}\n',
      c: '#include <stdio.h>\n\nint main() {\n    printf(Hello, Floyd Coder!\\n);\n    return 0;\n}\n',
      java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println(Hello, Floyd Coder!);\n    }\n}\n'
    },
    sampleTestCases: [
      {
        input: '',
        expectedOutput: 'Hello, Floyd Coder!',
        explanation: 'The program directly prints the welcome greeting.'
      }
    ],
    hiddenTestCases: [
      { input: '', expectedOutput: 'Hello, Floyd Coder!' }
    ]
  },
  {
    title: 'Sum of Two Numbers',
    slug: 'sum-of-two-numbers',
    difficulty: 'Beginner',
    category: 'Variables',
    order: 2,
    points: 100,
    description: 'Read two integers, **A** and **B**, and calculate their sum. Print the final result.',
    inputFormat: 'Two integers, separated by space or on separate lines.',
    outputFormat: 'Print a single integer: the sum of A and B.',
    constraints: '-10^6 <= A, B <= 10^6',
    starterTemplates: {
      python: '# Read two numbers and print their sum\nimport sys\ninput_data = sys.stdin.read().split()\nif input_data:\n    a = int(input_data[0])\n    b = int(input_data[1])\n    print(a + b)\n',
      javascript: 'const fs = require(fs);\nconst input = fs.readFileSync(0, utf-8).trim().split(/\\s+/);\nif (input.length >= 2) {\n    const a = parseInt(input[0]);\n    const b = parseInt(input[1]);\n    console.log(a + b);\n}\n',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    long long a, b;\n    if (cin >> a >> b) {\n        cout << (a + b) << endl;\n    }\n    return 0;\n}\n',
      c: '#include <stdio.h>\n\nint main() {\n    long long a, b;\n    if (scanf(%lld %lld, &a, &b) == 2) {\n        printf(%lld\\n, a + b);\n    }\n    return 0;\n}\n',
      java: 'import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextLong()) {\n            long a = sc.nextLong();\n            long b = sc.nextLong();\n            System.out.println(a + b);\n        }\n    }\n}\n'
    },
    sampleTestCases: [
      { input: '3 5', expectedOutput: '8', explanation: '3 + 5 = 8' },
      { input: '12 25', expectedOutput: '37', explanation: '12 + 25 = 37' }
    ],
    hiddenTestCases: [
      { input: '100 250', expectedOutput: '350' },
      { input: '-15 30', expectedOutput: '15' },
      { input: '0 0', expectedOutput: '0' }
    ]
  },
  {
    title: 'Odd or Even Explorer',
    slug: 'odd-or-even',
    difficulty: 'Beginner',
    category: 'Conditions',
    order: 3,
    points: 100,
    description: 'Given an integer **N**, determine whether it is **Even** or **Odd**.',
    inputFormat: 'A single integer N.',
    outputFormat: 'Print Even if the number is even, otherwise print Odd.',
    constraints: '-10^9 <= N <= 10^9',
    starterTemplates: {
      python: 'import sys\nn = int(sys.stdin.read().strip())\nif n % 2 == 0:\n    print(Even)\nelse:\n    print(Odd)\n',
      javascript: 'const fs = require(fs);\nconst n = parseInt(fs.readFileSync(0, utf-8).trim());\nconsole.log(n % 2 === 0 ? Even : Odd);\n',
      cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    long long n;\n    if (cin >> n) {\n        cout << (n % 2 == 0 ? Even : Odd) << endl;\n    }\n    return 0;\n}\n',
      c: '#include <stdio.h>\nint main() {\n    long long n;\n    if (scanf(%lld, &n) == 1) {\n        printf(%s\\n, (n % 2 == 0 ? Even : Odd));\n    }\n    return 0;\n}\n',
      java: 'import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextLong()) {\n            long n = sc.nextLong();\n            System.out.println(n % 2 == 0 ? Even : Odd);\n        }\n    }\n}\n'
    },
    sampleTestCases: [
      { input: '4', expectedOutput: 'Even', explanation: '4 is divisible by 2.' },
      { input: '7', expectedOutput: 'Odd', explanation: '7 leaves a remainder of 1.' }
    ],
    hiddenTestCases: [
      { input: '0', expectedOutput: 'Even' },
      { input: '101', expectedOutput: 'Odd' },
      { input: '-8', expectedOutput: 'Even' }
    ]
  },
  {
    title: 'Student Pass or Fail',
    slug: 'student-pass-or-fail',
    difficulty: 'Beginner',
    category: 'Conditions',
    order: 4,
    points: 100,
    description: 'At Floyd School, a student passes the examination if their total score is **40 or higher** out of 100. Write a program that prints **PASS** or **FAIL**.',
    inputFormat: 'A single integer representing the exam score.',
    outputFormat: 'Print PASS if score >= 40, otherwise print FAIL.',
    constraints: '0 <= score <= 100',
    starterTemplates: {
      python: 'import sys\nscore = int(sys.stdin.read().strip())\nif score >= 40:\n    print(PASS)\nelse:\n    print(FAIL)\n',
      javascript: 'const fs = require(fs);\nconst score = parseInt(fs.readFileSync(0, utf-8).trim());\nconsole.log(score >= 40 ? PASS : FAIL);\n',
      cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int score;\n    if (cin >> score) {\n        cout << (score >= 40 ? PASS : FAIL) << endl;\n    }\n    return 0;\n}\n',
      c: '#include <stdio.h>\nint main() {\n    int score;\n    if (scanf(%d, &score) == 1) {\n        printf(%s\\n, score >= 40 ? PASS : FAIL);\n    }\n    return 0;\n}\n',
      java: 'import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int score = sc.nextInt();\n            System.out.println(score >= 40 ? PASS : FAIL);\n        }\n    }\n}\n'
    },
    sampleTestCases: [
      { input: '78', expectedOutput: 'PASS', explanation: '78 is >= 40.' },
      { input: '35', expectedOutput: 'FAIL', explanation: '35 is < 40.' }
    ],
    hiddenTestCases: [
      { input: '40', expectedOutput: 'PASS' },
      { input: '100', expectedOutput: 'PASS' },
      { input: '0', expectedOutput: 'FAIL' }
    ]
  },
  {
    title: 'Counting 1 to N',
    slug: 'counting-1-to-n',
    difficulty: 'Beginner',
    category: 'Loops',
    order: 5,
    points: 100,
    description: 'Given a positive integer **N**, write a loop that prints all integers from 1 up to N on a single line, separated by spaces.',
    inputFormat: 'A single positive integer N.',
    outputFormat: 'Print numbers 1 through N separated by spaces.',
    constraints: '1 <= N <= 1000',
    starterTemplates: {
      python: 'import sys\nn = int(sys.stdin.read().strip())\nprint( .join(str(i) for i in range(1, n + 1)))\n',
      javascript: 'const fs = require(fs);\nconst n = parseInt(fs.readFileSync(0, utf-8).trim());\nconst nums = [];\nfor (let i = 1; i <= n; i++) nums.push(i);\nconsole.log(nums.join( ));\n',
      cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    if (cin >> n) {\n        for (int i = 1; i <= n; i++) {\n            cout << i << (i == n ? " :  );\n }\n cout << endl;\n }\n return 0;\n}\n',
 c: '#include <stdio.h>\nint main() {\n int n;\n if (scanf(%d, &n) == 1) {\n for (int i = 1; i <= n; i++) {\n printf(%d%s, i, i == n ?  :  );\n }\n printf(\\n);\n }\n return 0;\n}\n',
 java: 'import java.util.Scanner;\npublic class Main {\n public static void main(String[] args) {\n Scanner sc = new Scanner(System.in);\n if (sc.hasNextInt()) {\n int n = sc.nextInt();\n StringBuilder sb = new StringBuilder();\n for (int i = 1; i <= n; i++) {\n sb.append(i).append(i == n ?  :  );\n }\n System.out.println(sb.toString().trim());\n }\n }\n}\n'
 },
 sampleTestCases: [
 { input: '5', expectedOutput: '1 2 3 4 5', explanation: 'Numbers 1 to 5.' },
 { input: '3', expectedOutput: '1 2 3', explanation: 'Numbers 1 to 3.' }
 ],
 hiddenTestCases: [
 { input: '1', expectedOutput: '1' },
 { input: '10', expectedOutput: '1 2 3 4 5 6 7 8 9 10' }
 ]
 },
 {
 title: 'Find Maximum of Three',
 slug: 'find-maximum-of-three',
 difficulty: 'Intermediate',
 category: 'Functions',
 order: 6,
 points: 150,
 description: 'Read three numbers, **A**, **B**, and **C**, and output the maximum of the three numbers.',
 inputFormat: 'Three space-separated integers.',
 outputFormat: 'Print the maximum value.',
 constraints: '-10^6 <= A, B, C <= 10^6',
 starterTemplates: {
 python: 'import sys\nnums = list(map(int, sys.stdin.read().split()))\nif nums:\n print(max(nums))\n',
 javascript: 'const fs = require(fs);\nconst nums = fs.readFileSync(0, utf-8).trim().split(/\\s+/).map(Number);\nconsole.log(Math.max(...nums));\n',
 cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint main() {\n long long a, b, c;\n if (cin >> a >> b >> c) {\n cout << max({a, b, c}) << endl;\n }\n return 0;\n}\n',
 c: '#include <stdio.h>\nint main() {\n long long a, b, c;\n if (scanf(%lld %lld %lld, &a, &b, &c) == 3) {\n long long m = a;\n if (b > m) m = b;\n if (c > m) m = c;\n printf(%lld\\n, m);\n }\n return 0;\n}\n',
 java: 'import java.util.Scanner;\npublic class Main {\n public static void main(String[] args) {\n Scanner sc = new Scanner(System.in);\n if (sc.hasNextLong()) {\n long a = sc.nextLong();\n long b = sc.nextLong();\n long c = sc.nextLong();\n System.out.println(Math.max(a, Math.max(b, c)));\n }\n }\n}\n'
 },
 sampleTestCases: [
 { input: '10 45 22', expectedOutput: '45', explanation: '45 is the largest number.' },
 { input: '-5 -12 -1', expectedOutput: '-1', explanation: '-1 is the largest among negative numbers.' }
 ],
 hiddenTestCases: [
 { input: '100 100 50', expectedOutput: '100' },
 { input: '0 0 0', expectedOutput: '0' },
 { input: '999 12 4', expectedOutput: '999' }
 ]
 },
 {
 title: 'Array Sum Calculator',
 slug: 'array-sum-calculator',
 difficulty: 'Intermediate',
 category: 'Arrays',
 order: 7,
 points: 150,
 description: 'You are given an integer **N** representing the number of sensor readings, followed by **N** integers. Calculate and print the sum of all elements.',
 inputFormat: 'First line: integer N. Second line: N space-separated integers.',
 outputFormat: 'Print the sum of the array elements.',
 constraints: '1 <= N <= 1000, -1000 <= element <= 1000',
 starterTemplates: {
 python: 'import sys\ninput_data = sys.stdin.read().split()\nif input_data:\n n = int(input_data[0])\n arr = [int(x) for x in input_data[1:n+1]]\n print(sum(arr))\n',
 javascript: 'const fs = require(fs);\nconst tokens = fs.readFileSync(0, utf-8).trim().split(/\\s+/).map(Number);\nif (tokens.length > 1) {\n const n = tokens[0];\n const arr = tokens.slice(1, n + 1);\n console.log(arr.reduce((a, b) => a + b, 0));\n}\n',
 cpp: '#include <iostream>\nusing namespace std;\nint main() {\n int n;\n if (cin >> n) {\n long long sum = 0, val;\n for (int i = 0; i < n; i++) {\n cin >> val;\n sum += val;\n }\n cout << sum << endl;\n }\n return 0;\n}\n',
 c: '#include <stdio.h>\nint main() {\n int n;\n if (scanf(%d, &n) == 1) {\n long long sum = 0, val;\n for (int i = 0; i < n; i++) {\n scanf(%lld, &val);\n sum += val;\n }\n printf(%lld\\n, sum);\n }\n return 0;\n}\n',
 java: 'import java.util.Scanner;\npublic class Main {\n public static void main(String[] args) {\n Scanner sc = new Scanner(System.in);\n if (sc.hasNextInt()) {\n int n = sc.nextInt();\n long sum = 0;\n for (int i = 0; i < n; i++) {\n sum += sc.nextLong();\n }\n System.out.println(sum);\n }\n }\n}\n'
 },
 sampleTestCases: [
 { input: '4\n1 2 3 4', expectedOutput: '10', explanation: '1 + 2 + 3 + 4 = 10' },
 { input: '3\n10 20 30', expectedOutput: '60', explanation: '10 + 20 + 30 = 60' }
 ],
 hiddenTestCases: [
 { input: '5\n5 -5 10 -10 2', expectedOutput: '2' },
 { input: '1\n100', expectedOutput: '100' }
 ]
 },
 {
 title: 'Word Reverser',
 slug: 'word-reverser',
 difficulty: 'Intermediate',
 category: 'Strings',
 order: 8,
 points: 150,
 description: 'Given a word **S**, print the reversed string.',
 inputFormat: 'A single string S without spaces.',
 outputFormat: 'Print S in reverse order.',
 constraints: '1 <= length of S <= 500',
 starterTemplates: {
 python: 'import sys\ns = sys.stdin.read().strip()\nprint(s[::-1])\n',
 javascript: 'const fs = require(fs);\nconst s = fs.readFileSync(0, utf-8).trim();\nconsole.log(s.split().reverse().join());\n',
 cpp: '#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\nint main() {\n string s;\n if (cin >> s) {\n reverse(s.begin(), s.end());\n cout << s << endl;\n }\n return 0;\n}\n',
 c: '#include <stdio.h>\n#include <string.h>\nint main() {\n char s[1000];\n if (scanf(%s, s) == 1) {\n int len = strlen(s);\n for (int i = len - 1; i >= 0; i--) {\n putchar(s[i]);\n }\n putchar(\'\\n\');\n }\n return 0;\n}\n',
 java: 'import java.util.Scanner;\npublic class Main {\n public static void main(String[] args) {\n Scanner sc = new Scanner(System.in);\n if (sc.hasNext()) {\n String s = sc.next();\n System.out.println(new StringBuilder(s).reverse().toString());\n }\n }\n}\n'
 },
 sampleTestCases: [
 { input: 'floyd', expectedOutput: 'dyolf', explanation: 'Reverse of floyd is dyolf.' },
 { input: 'coding', expectedOutput: 'gnidoc', explanation: 'Reverse of coding is gnidoc.' }
 ],
 hiddenTestCases: [
 { input: 'robotics', expectedOutput: 'scitobor' },
 { input: 'a', expectedOutput: 'a' }
 ]
 },
 {
 title: 'Palindrome Detective',
 slug: 'palindrome-detective',
 difficulty: 'Advanced',
 category: 'Basic Problem Solving',
 order: 9,
 points: 200,
 description: 'A palindrome is a word that reads the same backward as forward (such as racecar or radar). Given a string **S** in lowercase letters, determine if it is a palindrome. Output **YES** or **NO**.',
 inputFormat: 'A single string S containing only lowercase English letters.',
 outputFormat: 'Print YES if S is a palindrome, otherwise print NO.',
 constraints: '1 <= length of S <= 10^4',
 starterTemplates: {
 python: 'import sys\ns = sys.stdin.read().strip()\nprint(YES if s == s[::-1] else NO)\n',
 javascript: 'const fs = require(fs);\nconst s = fs.readFileSync(0, utf-8).trim();\nconst rev = s.split().reverse().join();\nconsole.log(s === rev ? YES : NO);\n',
 cpp: '#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n string s;\n if (cin >> s) {\n bool isPal = true;\n int l = 0, r = s.length() - 1;\n while (l < r) {\n if (s[l++] != s[r--]) { isPal = false; break; }\n }\n cout << (isPal ? YES : NO) << endl;\n }\n return 0;\n}\n',
 c: '#include <stdio.h>\n#include <string.h>\nint main() {\n char s[10000];\n if (scanf(%s, s) == 1) {\n int l = 0, r = strlen(s) - 1, pal = 1;\n while (l < r) {\n if (s[l++] != s[r--]) { pal = 0; break; }\n }\n printf(%s\\n, pal ? YES : NO);\n }\n return 0;\n}\n',
 java: 'import java.util.Scanner;\npublic class Main {\n public static void main(String[] args) {\n Scanner sc = new Scanner(System.in);\n if (sc.hasNext()) {\n String s = sc.next();\n String rev = new StringBuilder(s).reverse().toString();\n System.out.println(s.equals(rev) ? YES : NO);\n }\n }\n}\n'
 },
 sampleTestCases: [
 { input: 'racecar', expectedOutput: 'YES', explanation: 'racecar reads identically backwards.' },
 { input: 'school', expectedOutput: 'NO', explanation: 'school backwards is loohcs, not equal.' }
 ],
 hiddenTestCases: [
 { input: 'level', expectedOutput: 'YES' },
 { input: 'noon', expectedOutput: 'YES' },
 { input: 'floydschool', expectedOutput: 'NO' }
 ]
 }
];

async function seed() {
 await mongoose.connect(process.env.MONGO_URI);
 console.log('Connected to MongoDB for Coding Problem seeding...');

 for (const prob of problems) {
 await CodingProblem.findOneAndUpdate(
 { slug: prob.slug },
 prob,
 { upsert: true, new: true, setDefaultsOnInsert: true }
 );
 console.log('✔ Seeded problem: ' + prob.title + ' (' + prob.slug + ')');
 }

 const total = await CodingProblem.countDocuments();
 console.log('🎉 Seeding complete! Total problems in database: ' + total);
 await mongoose.disconnect();
}

seed().catch(err => {
 console.error('Seeding error:', err);
 process.exit(1);
});
