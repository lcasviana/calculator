# Lotto & Bitcoin Calculator

This project is a challenge to test my frontend skills.

## How it works

- From a given date and time, the system will find the next Lotto Draw.
    - Lotto Draws happen on every Wed and Sat at 8pm.
- From the next Lotto Draw date, the system will get the Bitcoin value at that moment.
- The system will also get the current Bitcoin value.
- Finally, it will return your winnings based on the previous and current Bitcoin value.
    - Your winnings will be based on €100 investment at Lotto Draw date.

## How to use

1. Access the [Lotto & Bitcoin Calculator](https://lcasviana.github.io/calculator/).
    - **OR** download/clone the repository and open the `index.html` file.
2. Insert a date and a time using the input (_default_: current).
3. Press the `Submit` button to get your winnings.
4. Find in the table below the result.

## Folder structure

```
📁 calculator
├── 📁 public
│   ├── 📁 assets
│   │   └── 🖼️ coin.gif
│   ├── 📁 scripts
│   │   └── 📃 script.js
│   └── 📁 styles
│       └── 📑 styles.css
├── 📄 index.html
└── 📝 README.md
```