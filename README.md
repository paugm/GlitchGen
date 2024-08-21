![GlitchGen Logo](https://glitchgen.ai/logo.png)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Version](https://img.shields.io/badge/version-0.4.1-blue.svg)](https://github.com/paugm/GlitchGen/releases)

> Building a time machine to the 90s web! 🚀

GlitchGen is a web application for building retro-inspired websites using modern web technologies. Dive into the nostalgic world of 90s web design with a twist of contemporary flair!

[Try the demo](https://glitchgen.ai)

## 🌟 Features

- 📟 Drag-and-drop interface for easy website building
- 🎨 Retro-inspired design elements
- 🖼️ Image & GIF search and AI-powered image generation
- 🎵 Built-in MIDI-style music player
- 🌈 Customizable styles and backgrounds
- 📱 Responsive design capabilities
- 🔌 Easy export options

## 🚀 Quick Start (on free hosted version)

1. Visit [GlitchGen.ai](https://glitchgen.ai)
2. Click on "New Website"
3. Choose a template or start from scratch
4. Drag and drop elements onto your canvas
5. Customize your website with retro flair
6. Export and share your creation!

## 🏠 Running GlitchGen Locally (No Technical Knowledge Required)

If you're not comfortable with command-line interfaces or don't have technical knowledge, you can still run GlitchGen on your local machine. Here's a step-by-step guide:

- Download the Latest Release
- Extract the Files
- In the `public` folder, find the file named `index.html` and open it with a modern browser like Google Chrome or Microsoft Edge.
- You're now running GlitchGen locally and you can start building your retro-inspired websites!

By following these steps, you can easily run GlitchGen on your local machine without needing any technical setup or knowledge. Enjoy creating your nostalgic websites!

## 🛠️ Local Installation and Expansion (Technical Approach)

To set up GlitchGen locally:

1. Clone the repository:
   ```
   git clone https://github.com/paugm/GlitchGen.git
   ```

2. Navigate to the project directory:
   ```
   cd GlitchGen
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Build the project and compile js/css:
   ```
   npm run build && npm run build:css
   ```

5. Open the `public/index.html` file in your browser or through a local web server to start using the application.


## 🧩 Available Elements

GlitchGen provides a variety of elements by default to build retro-inspired websites:

1. **Upload Image**: Add your own images to the website.
2. **Web Ring**: Create a nostalgic web ring to link related sites.
3. **Spinning 3D Text**: Add eye-catching rotating 3D text with various styles.
4. **Button**: Create interactive buttons with retro designs.
5. **Info Card**: Display information in stylized card format.
6. **HTML Block**: Insert custom HTML for advanced users.
7. **Image Web Search**: Search and add images from the web (requires Unsplash API key).
8. **Table**: Create structured data tables with customizable styles.
9. **List**: Add ordered or unordered lists to your page.
10. **Glitter Text**: Generate sparkly, animated text.
11. **Marquee Banner**: Create scrolling text banners.
12. **Gif**: Search and add GIFs to your site (requires Giphy API key).
13. **Music Box**: Add a MIDI-style music player with various tunes.
14. **Header**: Insert headers with different sizes and styles.
15. **Alert Box**: Create attention-grabbing alert messages.
16. **AI Image**: Generate images using AI (requires OpenAI API key).
17. **Video Player**: Embed YouTube or Vimeo videos.
18. **Website Loader**: Embed other websites within your page.
19. **Weather Widget**: Display current weather for a specified location.
20. **Emoji**: Add large, customizable emoji to your design.

## 🔧 JS/CSS Packages and Frameworks Used

- Vanilla JavaScript ❤️👍🏼
- Tailwind CSS
- GSAP (GreenSock Animation Platform)
- DOMPurify
- Emoji-mart
## 📁 Project Structure

Here's an overview of the main directories and files:

```
GlitchGen/
├── public/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   ├── bgs/
│   │   └── [background images]
│   └── templates/
│       └── [template .glitchGen files]
├── src/
│   ├── builder.js
│   ├── dragDropManager.js
│   └── elements.js
├── package.json
└── webpack.config.js
```

## 🗂️ Directory Explanations:

- **`public/`**: This directory contains the files that are directly accessible to users.
  - `index.html`: The main HTML file that loads the GlitchGen application.
  - `css/styles.css`: Contains all the styles for the application, including Tailwind utility classes.
  - `bgs/`: Stores background images used in the application.
  - `templates/`: Contains pre-made website templates in .glitchGen format.

- **`src/`**: This directory contains the source JavaScript files.
  - `builder.js`: The main application logic, handling UI interactions, element creation, and export functionality.
  - `dragDropManager.js`: Manages the drag-and-drop functionality for placing elements on the canvas.
  - `elements.js`: Defines all available elements, their properties, and configuration options.

- **`package.json`**: Lists the project dependencies and scripts for building and running the application.

- **`webpack.config.js`**: Configuration file for Webpack, which bundles the JavaScript files for production use.


## 🧠 How the Code Works

GlitchGen is built using vanilla JavaScript and follows a modular structure:

1. **Builder**: The main `builder.js` file orchestrates the entire application:
   - Initializes the drag-and-drop functionality
   - Manages the creation and configuration of elements
   - Handles the export process
   - Manages modals and user interactions

2. **Element Configurations**: The `elements.js` file defines all available elements, their properties, and configuration options.

3. **Drag and Drop Manager**: The `DragDropManager` class in `dragDropManager.js` handles the drag-and-drop functionality for placing elements on the canvas.

4. **API Integrations**: For elements requiring external data, the app makes API calls when those elements are configured or rendered:
- [OpenAI](https://openai.com/) for the AI image generation capabilities
- [Unsplash](https://unsplash.com/) for providing high-quality stock images
- [GIPHY](https://giphy.com/) for the vast collection of GIFs


## 🤝 Contributing

We welcome contributions from the community! If you'd like to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## 📜 License

GlitchGen is open-source software licensed under the MIT license. See the [LICENSE](LICENSE) file for more details.

---

Made with ❤️ and a sprinkle of nostalgia. Now go forth and create some rad websites! 😎🌟
