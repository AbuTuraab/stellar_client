# Code Style Guide

This document outlines the coding style and conventions to be followed when contributing to the Fundable Stellar project. Adhering to these guidelines ensures consistency and readability across the codebase.

## General Principles

-   **Follow Existing Conventions:** When in doubt, look at the existing code in the file or related files and follow its patterns.
-   **Write Clear and Readable Code:** Write code that is easy for other developers to understand. Favor clarity over brevity.
-   **Keep it Simple:** Avoid unnecessary complexity.

---

## Frontend & SDK (TypeScript/JavaScript)

We use [Prettier](https://prettier.io/) for automatic code formatting and [ESLint](https://eslint.org/) for identifying and reporting on patterns in JavaScript.

### Formatting (Prettier)

All TypeScript/JavaScript code is formatted using Prettier. It's recommended to set up your editor to format on save. A `.prettierrc` file should be present in the project with the configuration.

**Example `.prettierrc`:**
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

### Linting (ESLint)

ESLint helps us to prevent bugs and ensure code quality. The configuration can be found in `eslint.config.mjs` (or similar). Please ensure your contributions have no ESLint errors.

### Naming Conventions

-   **Variables and Functions:** Use `camelCase`.
    -   `const myVariable = '...';`
    -   `function doSomething() { ... }`
-   **Classes, Interfaces, and React Components:** Use `PascalCase`.
    -   `class MyClass { ... }`
    -   `interface UserProfile { ... }`
    -   `function UserProfile() { ... }`
-   **Constants:** Use `UPPER_SNAKE_CASE` for constants that are hardcoded and reused across the application.
    -   `const MAX_RETRIES = 3;`

### Imports

Organize imports at the top of the file in the following order:
1.  React imports
2.  External library imports
3.  Internal module imports (from the same project)
4.  Relative imports

### Comments

-   Use comments to explain *why* something is done, not *what* is being done. The code should be self-explanatory about what it does.
-   Use `// TODO:` for planned work.
-   Use `// FIXME:` for code that needs to be fixed.

---

## Smart Contracts (Rust)

For Rust code, we adhere to the standard Rust conventions, enforced by `rustfmt` and `clippy`.

### Formatting (`rustfmt`)

All Rust code is formatted using `rustfmt`. Ensure you have it installed (`rustup component add rustfmt`) and run `cargo fmt` before committing your changes.

### Linting (`clippy`)

Clippy is used to catch common mistakes and improve your code. Run `cargo clippy` to check your code for lints.

### Naming Conventions

-   **Variables and Functions:** Use `snake_case`.
    -   `let my_variable = 10;`
    -   `fn do_something() { ... }`
-   **Structs, Enums, and Traits:** Use `PascalCase`.
    -   `struct MyStruct { ... }`
    -   `enum MyEnum { ... }`
-   **Constants:** Use `UPPER_SNAKE_CASE`.
    -   `const MAX_VALUE: u32 = 100;`

### Documentation

-   Use doc comments (`///`) to document all public functions, structs, and enums. Explain what the item does, its parameters, and what it returns.
-   This documentation is used to generate the contract's API reference.
