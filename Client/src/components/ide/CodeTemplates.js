export const CODE_TEMPLATES = {
    63: {
        // JavaScript
        name: 'JavaScript',
        template: `// JavaScript Code
console.log("Hello, World!");

// Your code here
function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet("ThinkSkool"));`
    },
    71: {
        // Python
        name: 'Python',
        template: `# Python Code
print("Hello, World!")

# Your code here
def greet(name):
    return f"Hello, {name}!"

print(greet("ThinkSkool"))`
    },
    62: {
        // Java
        name: 'Java',
        template: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Your code here
        String message = greet("ThinkSkool");
        System.out.println(message);
    }
    
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
}`
    },
    54: {
        // C++
        name: 'C++',
        template: `#include <iostream>
#include <string>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    
    // Your code here
    string name = "ThinkSkool";
    cout << "Hello, " << name << "!" << endl;
    
    return 0;
}`
    },
    50: {
        // C
        name: 'C',
        template: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    
    // Your code here
    char name[] = "ThinkSkool";
    printf("Hello, %s!\\n", name);
    
    return 0;
}`
    },
    51: {
        // C#
        name: 'C#',
        template: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
        
        // Your code here
        string message = Greet("ThinkSkool");
        Console.WriteLine(message);
    }
    
    static string Greet(string name) {
        return $"Hello, {name}!";
    }
}`
    },
    72: {
        // Ruby
        name: 'Ruby',
        template: `# Ruby Code
puts "Hello, World!"

# Your code here
def greet(name)
  "Hello, #{name}!"
end

puts greet("ThinkSkool")`
    },
    68: {
        // PHP
        name: 'PHP',
        template: `<?php
echo "Hello, World!\\n";

// Your code here
function greet($name) {
    return "Hello, $name!";
}

echo greet("ThinkSkool");
?>`
    },
    60: {
        // Go
        name: 'Go',
        template: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
    
    // Your code here
    message := greet("ThinkSkool")
    fmt.Println(message)
}

func greet(name string) string {
    return fmt.Sprintf("Hello, %s!", name)
}`
    },
    78: {
        // Kotlin
        name: 'Kotlin',
        template: `fun main() {
    println("Hello, World!")
    
    // Your code here
    val message = greet("ThinkSkool")
    println(message)
}

fun greet(name: String): String {
    return "Hello, $name!"
}`
    },
    74: {
        // TypeScript
        name: 'TypeScript',
        template: `// TypeScript Code
console.log("Hello, World!");

// Your code here
function greet(name: string): string {
    return \`Hello, \${name}!\`;
}

console.log(greet("ThinkSkool"));`
    },
    83: {
        // Swift
        name: 'Swift',
        template: `import Foundation

print("Hello, World!")

// Your code here
func greet(name: String) -> String {
    return "Hello, \\(name)!"
}

print(greet(name: "ThinkSkool"))`
    }
};

export const getTemplate = (languageId) => {
    return CODE_TEMPLATES[languageId]?.template || '// Start coding...';
};
