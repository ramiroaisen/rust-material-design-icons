# Material Design Icons for Rust

This crate provides Material Design Icons as string constants, making it easy to integrate these icons into your Rust projects.

The crate is automatically published to [crates.io](https://crates.io) using a GitHub Action
every time there's a new version of [@mdi/js](https://npmjs.com/package/@mdi/js) npm package.
Ensuring that you have access to the latest icons from mdi.

Versions of this crate are automatically synced with the versions of @mdi/js npm package.

## Features
- Access Material Design Icons as string constants.
- Lightweight and dependency-free.
- Compatible with any Rust version.

## Installation
```sh
cargo add material-design-icons
```

## Usage
To use the icons in your project, simply import the crate and access the constants:
The constants refer to the <path d={}> attribute for SVG icons.


```rust
/// Example for a Leptos/Sycamore DOM like framework, adjust it according to your needs.
use material_design_icons as mdi;

#[component]
fn App() -> View {
  view! {
    <svg viewBox="0 0 24 24">
      <path d=mdi::CHECK />
    </svg>
  }
}
```

## Repository
The source code for this crate is available on [GitHub](https://github.com/ramiroaisen/material-design-icons).

## License
This project is dual-licensed under either:
- [MIT License](./LICENSE-MIT)
- [Apache License, Version 2.0](./LICENSE-APACHE)