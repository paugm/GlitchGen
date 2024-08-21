# .glitchGen File Specification

## Version 1.7

## Overview

The .glitchGen file is a JSON-formatted configuration file used to define the layout and content of a website created with the glitchGen 90s-style website builder. This specification outlines the structure and components of the file.

## File Structure

The .glitchGen file is a single JSON object containing the following top-level keys:

- `version` (string): The version of the specification. Use "1.6".
- `title` (string): The title of the website.
- `gridSize` (number): The size of the grid for snapping elements (in pixels). Possible values: 10, 20, 30, 40, 50, 60.
- `font` (string): The primary font. Possible values: "Roboto", "Open Sans", "Lato", "Montserrat", "Playfair Display", "Merriweather", "Nunito", "Raleway", "Poppins", "Ubuntu".
- `textColor` (string): The default text color (in hexadecimal format).
- `dropZoneWidth` (number): The width of the main content area (in pixels). Possible values: 1200.
- `dropZoneHeight` (number): The height of the main content area (in pixels). Possible values: 800.
- `background` (string): The background image or color of the website. Possible values: "" (none), "url(\"./bgs/1.gif\")", "url(\"./bgs/2.gif\")", "url(\"./bgs/3.gif\")", "url(\"./bgs/4.gif\")", "url(\"./bgs/5.gif\")", "url(\"./bgs/6.gif\")".
- `elements` (array): An array of element objects representing the content of the website.

## Element Object Structure

Each element in the `elements` array is an object with the following properties:

- `id` (string): A unique identifier for the element
- `type` (string): The type of the element (must be one of the predefined element types)
- `left` (number): The horizontal position of the element (as a PERCENTAGE of the drop zone width)
- `top` (number): The vertical position of the element (as a PERCENTAGE of the drop zone height)
- `width` (number): The width of the element (as a PERCENTAGE of the drop zone width)
- `height` (number): The height of the element (as a PERCENTAGE of the drop zone height)
- `layerOrder` (number): The z-index of the element (determines stacking order), starting by 1.
- `properties` (object): An object containing element-specific properties

## Element Types and Properties

The following element types are supported, each with its own set of properties:

### Web Ring (min height: 80px, min width: 200px)

- `title` (string): The title of the web ring.
- `prevLink` (string): URL for the previous site in the ring.
- `nextLink` (string): URL for the next site in the ring.
- `style` (string): Visual style of the web ring. Possible values: "Classic", "Neon", "Retro", "Minimalist", "Cyberpunk", "Elegant".

### Spinning 3D Text (min height: 100px, min width: 200px)

- `text` (string): The text content to display.
- `style` (string): Visual style of the text. Possible values: "Neon", "Rainbow", "Metallic", "Glitch", "Pixelated".
- `spinSpeed` (string): Speed of the spinning animation. Possible values: "animate-spin-slow", "animate-spin-medium", "animate-spin-fast".

### Button (min height: 55px, min width: 150px)

- `text` (string): The text displayed on the button.
- `url` (string): The URL the button links to.
- `style` (string): The button style class. Possible values: "button-style-1", "button-style-2", "button-style-3", "button-style-4", "button-style-5", "button-style-6".

### Info Card (min height: 150px, min width: 250px)

- `title` (string): The title of the card.
- `content` (string): The main content of the card.
- `style` (string): Visual style of the card. Possible values: "Default", "Minimal", "Dark", "Colorful".

### HTML Block (min height: 100px, min width: 200px)

- `text` (string): The HTML content of the block.
- `style` (string): Visual style of the HTML block. Possible values: "Retro 90s", "Blank", "Modern Clean", "Neon Glow", "Minimalist", "Grunge".

### Image Web Search (min height: 100px, min width: 100px)

- `imageSearch` (string): Search query for finding the image.

### Table (min height: 100px, min width: 200px)

- `headers` (string): Comma-separated list of table headers.
- `rows` (string): Newline-separated list of comma-separated table rows.
- `alternateRowColor` (boolean): Whether to use alternating row colors.
- `alternateColor` (string): The color for alternating rows.

### List (min height: 100px, min width: 100px)

- `items` (string): Newline-separated list of list items.
- `type` (string): Either "unordered" or "ordered".

### Glitter Text (min height: 80px, min width: 150px)

- `text` (string): The text content.

### Marquee Banner (min height: 100px, min width: 200px)

- `text` (string): The scrolling text content.

### Gif (min height: 100px, min width: 100px)

- `giphySearch` (string): The search term for finding the expected GIF.

### Music Box (min height: 150px, min width: 200px)

- `song` (string): The selected song. Possible values: "starwars", "harrypotter", "jamesbond", "indianajones", "jurassicpark", "pirates", "mario", "zelda", "tetris".
- `style` (string): Visual style of the music box. Possible values: "Classic", "Neon", "Retro", "Minimalist", "Futuristic".

### Header (min height: 50px, min width: 150px)

- `text` (string): The header text content.
- `level` (string): The size of the header. Possible values: "text-xs", "text-sm", "text-base", "text-xl", "text-3xl", "text-6xl", "text-9xl".

### Alert Box (min height: 50px, min width: 100px)

- `text` (string): The text content of the alert.
- `type` (string): The type of alert. Possible values: "info", "success", "warning", "error".

### AI Image (min height: 100px, min width: 100px)

- `imagePrompt` (string): The prompt used to generate the image.

### Website Loader (min height: 300px, min width: 300px)

- `websiteUrl` (string): The URL of the website to load in the iframe.

### Weather Widget (min height: 150px, min width: 200px)

- `location` (string): The location for which to display weather information.

### Emoji (min height: 50px, min width: 50px)

- `emoji` (string): The Unicode representation of the selected emoji.

## Example output:

{
"version": "1.6",
  "title": "Nice website title",
  "gridSize": 20,
  "font": "Roboto",
  "textColor": "#000000",
  "dropZoneWidth": 1200,
  "dropZoneHeight": 800,
  "background": "url(\"./bgs/4.gif\")",
  "elements": [
    {
      "id": "element-1",
      "type": "Button",
      "left": 23.6827,
      "top": 17.8628,
      "width": 19.7355,
      "height": 7.01754,
      "layerOrder": 0,
      "properties": {
        "text": "Button",
        "bgColor": "#3b82f6",
        "textColor": "#ffffff"
      }
    }
    ... (more elements)
  ]
}