# QR Studio

> Create sharp, customizable QR codes in seconds.

QR Studio is a lightweight QR code generator built with vanilla HTML, CSS, and JavaScript. Enter a URL or message, customize the look, and download or copy a ready-to-share QR code — no account or build step required.

### [Live Demo](https://dynaqr-generator.netlify.app/) · [Repository](https://github.com/ApoorvBytes/dynaqr-generator)

![QR Studio preview](https://github.com/user-attachments/assets/0981aaa6-21dd-4378-a8e3-7c8fb2ad8b42)

## Highlights

- Generate QR codes for links, text, messages, and more
- Live preview with high error correction for reliable scanning
- Customize QR color, background color, and size
- Download QR codes as PNG files
- Copy the generated QR image directly to the clipboard
- Quick-start examples for a website or message
- Recent codes saved locally in the browser for easy reuse
- Dark and light themes with a responsive mobile layout
- Character counter, reset controls, validation, and helpful empty states
- Private by design: content stays in the browser

## Built with

- **HTML5** — semantic structure and accessible controls
- **CSS3** — responsive layout, theme variables, glass panels, and visual states
- **JavaScript** — QR generation, downloads, clipboard actions, history, and theme persistence
- **[QRCode.js](https://github.com/davidshimjs/qrcodejs)** — client-side QR rendering

## Getting started

QR Studio is a static project, so no package manager or build process is needed.

### Run locally

1. Clone the repository:

   ```bash
   git clone https://github.com/ApoorvBytes/dynaqr-generator.git
   cd dynaqr-generator
   ```

2. Start a local server. For example, with Python:

   ```bash
   python -m http.server 8000
   ```

3. Open [http://localhost:8000](http://localhost:8000) in your browser.

You can also open `index.html` directly, although a local server is recommended for the clipboard feature.

## How to use

1. Enter a URL or any text in the content field.
2. Choose the QR color, background, and size.
3. Select **Generate QR code** or press `Ctrl + Enter`.
4. Copy the QR image or download it as a PNG.
5. Reuse previous codes from the **Recent codes** section.

## Project structure

```text
qr-code-generator/
├── index.html     # App structure and accessible UI
├── style.css      # Layout, themes, responsive styling
├── script.js      # QR generation and app interactions
└── README.md      # Project documentation
```

## Privacy

QR content is processed in the browser. Recent codes and theme preferences use `localStorage` on your device; no project backend or account is required.

## Part of a challenge

This project was created for the **7 Days · 7 Projects Challenge** — a build-in-public challenge focused on shipping small, practical projects and improving frontend development skills.

## Author

**Apoorv Khobragade**

- GitHub: [@ApoorvBytes](https://github.com/ApoorvBytes)

## License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).
