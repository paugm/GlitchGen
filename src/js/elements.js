import DOMPurify from "dompurify";
import { Picker } from "emoji-mart";
const version_elements = "1.7";

const elementConfigs = {
  "Upload Image": {
    innerHTML: `
    <div class="relative w-full h-full overflow-hidden bg-gray-100 flex items-center justify-center">
      <img src="" alt="Uploaded image" class="w-full h-full object-cover">
      <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white text-center p-4 no-image-text overflow-hidden">
      <div class="absolute inset-0 bg-yellow-300 opacity-30"></div>
      <div class="absolute inset-0 bg-blue-500 mix-blend-overlay filter blur-xl"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-20"></div>
      <div class="z-10 text-white font-bold  tracking-widest transform -rotate-2 flex flex-col items-center">
        <span class="inline-block transform hover:scale-110 transition-transform duration-300 glitch-text text-3xl ">Image Upload</span>
        <span class="inline-block transform hover:scale-110 transition-transform duration-300 glitch-text text-sm">Click here to search</span>
      </div>
      <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-yellow-300 to-pink-500 rounded-full filter blur-xl opacity-75 "></div>
      <div class="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-purple-300 to-cyan-500 rounded-full filter blur-xl opacity-75 "></div>
      <div class="absolute bottom-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-pink-300 to-yellow-500 rounded-full filter blur-xl opacity-75 "></div>
    </div>
  `,
    category: "Media Elements",
    minWidth: "100px",
    minHeight: "100px",
    width: "300px",
    height: "300px",
    resize: "both",
    icon: "upload",
    configOptions: [
      { name: "altText", type: "text", label: "Alt Text" },
      {
        name: "fitStyle",
        type: "select",
        label: "Image Fit",
        options: [
          { value: "cover", label: "Cover" },
          { value: "contain", label: "Contain" },
          { value: "fill", label: "Fill" },
        ],
      },
      { name: "uploadNewImage", type: "file", label: "Upload New Image" },
    ],
    getProperties: (element) => ({
      altText: element.querySelector("img").alt,
      fitStyle: element.querySelector("img").style.objectFit || "cover",
      imageData: element.querySelector("img").src,
    }),
    setProperties: (element, properties) => {
      const img = element.querySelector("img");
      const noImageText = element.querySelector(".no-image-text");
      if (properties.altText) img.alt = properties.altText;
      if (properties.fitStyle) img.style.objectFit = properties.fitStyle;
      if (properties.imageData && properties.imageData !== img.src) {
        img.src = properties.imageData;
        if (
          properties.imageData.startsWith("data:") ||
          properties.imageData.startsWith("http")
        ) {
          noImageText.style.display = "none";
        } else {
          noImageText.style.display = "flex";
        }
      }
    },
  },

  "Web Ring": {
    innerHTML: `
    <div class="web-ring w-full h-full flex flex-col items-center justify-center">
      <h3 class="web-ring-title text-lg font-bold mb-2">Web Ring</h3>
      <div class="flex space-x-4">
        <a href="#" class="web-ring-prev px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Previous</a>
        <a href="#" class="web-ring-next px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Next</a>
      </div>
    </div>
  `,
    category: "Interactive Elements",
    minWidth: "200px",
    minHeight: "80px",
    width: "300px",
    height: "100px",
    resize: "both",
    icon: "share-alt",
    configOptions: [
      { name: "title", type: "text", label: "Web Ring Title" },
      { name: "prevLink", type: "text", label: "Previous Link URL" },
      { name: "nextLink", type: "text", label: "Next Link URL" },
      {
        name: "style",
        type: "custom",
        label: "Web Ring Style",
        render: (element) => {
          const container = document.createElement("div");
          container.className = "grid grid-cols-2 gap-2 mt-2";

          const styles = [
            {
              name: "Classic",
              class:
                "bg-gray-200 text-gray-800 border border-gray-400 hover:bg-gray-300",
              titleClass: "text-gray-800",
            },
            {
              name: "Neon",
              class:
                "bg-black text-neon-green border border-neon-green hover:bg-neon-green hover:text-black",
              titleClass: "text-neon-green",
            },
            {
              name: "Retro",
              class:
                "bg-yellow-300 text-purple-700 border-2 border-purple-700 font-bold hover:bg-purple-700 hover:text-yellow-300",
              titleClass: "text-purple-700",
            },
            {
              name: "Minimalist",
              class:
                "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100",
              titleClass: "text-gray-800",
            },
            {
              name: "Cyberpunk",
              class:
                "bg-cyan-400 text-pink-600 border border-pink-600 font-bold hover:bg-pink-600 hover:text-cyan-400",
              titleClass: "text-pink-600",
            },
            {
              name: "Elegant",
              class:
                "bg-gradient-to-r from-purple-500 to-pink-500 text-white border border-white hover:from-pink-500 hover:to-purple-500",
              titleClass: "text-purple-500",
            },
          ];

          styles.forEach((style) => {
            const button = document.createElement("button");
            button.className = `w-full p-2 ${style.class} rounded transition-colors duration-200`;
            button.textContent = style.name;
            button.onclick = () => {
              const webRing = element.querySelector(".web-ring");
              const title = webRing.querySelector(".web-ring-title");
              const prevButton = webRing.querySelector(".web-ring-prev");
              const nextButton = webRing.querySelector(".web-ring-next");

              title.className = `web-ring-title text-lg font-bold mb-2 ${style.titleClass}`;
              prevButton.className = `web-ring-prev px-4 py-2 rounded transition-colors ${style.class}`;
              nextButton.className = `web-ring-next px-4 py-2 rounded transition-colors ${style.class}`;

              element.setAttribute("data-style", style.name);
            };
            container.appendChild(button);
          });

          return container;
        },
      },
    ],
    getProperties: (element) => ({
      title: element.querySelector(".web-ring-title").textContent,
      prevLink: element.querySelector(".web-ring-prev").getAttribute("href"),
      nextLink: element.querySelector(".web-ring-next").getAttribute("href"),
      style: element.getAttribute("data-style") || "Classic",
    }),
    setProperties: (element, properties) => {
      const title = element.querySelector(".web-ring-title");
      const prevButton = element.querySelector(".web-ring-prev");
      const nextButton = element.querySelector(".web-ring-next");

      if (properties.title) title.textContent = properties.title;
      if (properties.prevLink)
        prevButton.setAttribute("href", properties.prevLink);
      if (properties.nextLink)
        nextButton.setAttribute("href", properties.nextLink);

      if (properties.style) {
        const styles = {
          Classic: {
            button:
              "bg-gray-200 text-gray-800 border border-gray-400 hover:bg-gray-300",
            title: "text-gray-800",
          },
          Neon: {
            button:
              "bg-black text-neon-green border border-neon-green hover:bg-neon-green hover:text-black",
            title: "text-neon-green",
          },
          Retro: {
            button:
              "bg-yellow-300 text-purple-700 border-2 border-purple-700 font-bold hover:bg-purple-700 hover:text-yellow-300",
            title: "text-purple-700",
          },
          Minimalist: {
            button:
              "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100",
            title: "text-gray-800",
          },
          Cyberpunk: {
            button:
              "bg-cyan-400 text-pink-600 border border-pink-600 font-bold hover:bg-pink-600 hover:text-cyan-400",
            title: "text-pink-600",
          },
          Elegant: {
            button:
              "bg-gradient-to-r from-purple-500 to-pink-500 text-white border border-white hover:from-pink-500 hover:to-purple-500",
            title: "text-white",
          },
        };

        const style = styles[properties.style] || styles.Classic;
        title.className = `web-ring-title text-lg font-bold mb-2 ${style.title}`;
        prevButton.className = `web-ring-prev px-4 py-2 rounded transition-colors ${style.button}`;
        nextButton.className = `web-ring-next px-4 py-2 rounded transition-colors ${style.button}`;
        element.setAttribute("data-style", properties.style);
      }
    },
  },
  "Spinning 3D Text": {
    innerHTML: `
      <div class="spinning-3d-text w-full h-full flex items-center justify-center perspective-500">
        <h2 class="text-3xl font-bold transform-style-3d animate-spin-slow text-style-neon">Cool 3D Text</h2>
      </div>
    `,
    category: "Text Elements",
    minWidth: "200px",
    minHeight: "100px",
    width: "300px",
    height: "150px",
    resize: "both",
    icon: "cube",
    configOptions: [
      { name: "text", type: "text", label: "Text Content" },
      {
        name: "style",
        type: "custom",
        label: "Text Style",
        render: (element) => {
          const container = document.createElement("div");
          container.className = "grid grid-cols-3 gap-2 mt-2";

          const styles = [
            { name: "Neon", class: "text-style-neon" },
            { name: "Rainbow", class: "text-style-rainbow" },
            { name: "Metallic", class: "text-style-metallic" },
            { name: "Glitch", class: "text-style-glitch" },
            { name: "Pixelated", class: "text-style-pixelated" },
          ];

          styles.forEach((style) => {
            const button = document.createElement("button");
            button.className = `w-full p-2 ${style.class}`;
            button.textContent = style.name;
            button.onclick = () => {
              const textElement = element.querySelector("h2");
              textElement.className = `text-3xl font-bold transform-style-3d animate-spin-slow ${style.class}`;
            };
            container.appendChild(button);
          });

          return container;
        },
      },
      {
        name: "spinSpeed",
        type: "select",
        label: "Spin Speed",
        options: [
          { value: "animate-spin-slow", label: "Slow" },
          { value: "animate-spin-medium", label: "Medium" },
          { value: "animate-spin-fast", label: "Fast" },
        ],
      },
    ],
    getProperties: (element) => ({
      text: element.querySelector("h2").textContent,
      style:
        element
          .querySelector("h2")
          .className.split(" ")
          .find((cls) => cls.startsWith("text-style-")) || "text-style-neon",
      spinSpeed: element
        .querySelector("h2")
        .className.split(" ")
        .find((cls) => cls.startsWith("animate-spin-")),
    }),
    setProperties: (element, properties) => {
      const textElement = element.querySelector("h2");
      if (properties.text) textElement.textContent = properties.text;
      if (properties.style) {
        const oldStyle = textElement.className
          .split(" ")
          .find((cls) => cls.startsWith("text-style-"));
        if (oldStyle) textElement.classList.remove(oldStyle);
        textElement.classList.add(properties.style || "text-style-neon");
      }
      if (properties.spinSpeed) {
        const oldSpeed = textElement.className
          .split(" ")
          .find((cls) => cls.startsWith("animate-spin-"));
        if (oldSpeed) textElement.classList.remove(oldSpeed);
        textElement.classList.add(properties.spinSpeed);
      }
    },
    onResize: (element) => {
      const textElement = element.querySelector("h2");
      const containerWidth = element.offsetWidth;
      const containerHeight = element.offsetHeight;
      const fontSize = Math.min(containerWidth / 10, containerHeight / 3);
      textElement.style.fontSize = `${fontSize}px`;
    },
  },
  Button: {
    innerHTML:
      '<a href="#" class="button-style-5 w-full h-full flex items-center justify-center">Cool Button</a>',
    category: "Interactive Elements",
    minWidth: "150px",
    minHeight: "55px",
    width: "250px",
    resize: "horizontal",
    icon: "link",
    configOptions: [
      { name: "text", type: "text", label: "Button Text" },
      { name: "url", type: "text", label: "URL" },
      {
        name: "style",
        type: "custom",
        label: "Button Style",
        render: (element) => {
          const container = document.createElement("div");
          container.className = "grid grid-cols-3 gap-2 mt-2";

          const styles = [
            { name: "Neon Glow", class: "button-style-1" },
            { name: "Holographic", class: "button-style-2" },
            { name: "Pixelated", class: "button-style-3" },
            { name: "Bubble", class: "button-style-4" },
            { name: "Rainbow", class: "button-style-5" },
            { name: "Glitch", class: "button-style-6" },
          ];

          styles.forEach((style) => {
            const button = document.createElement("button");
            button.className = `w-full p-2 ${style.class}`;
            button.textContent = style.name;
            button.onclick = () => {
              element.querySelector("a").className =
                `${style.class} w-full h-full flex items-center justify-center`;
            };
            container.appendChild(button);
          });

          return container;
        },
      },
    ],
    getProperties: (element) => ({
      text: element.querySelector("a").textContent,
      url: element.querySelector("a").getAttribute("href"),
      style: element.querySelector("a").className.split(" ")[0],
    }),
    setProperties: (element, properties) => {
      const link = element.querySelector("a");
      if (properties.text) link.textContent = properties.text;
      if (properties.url) link.setAttribute("href", properties.url);
      if (properties.style) {
        const oldStyle = link.className.split(" ")[0];
        link.classList.remove(oldStyle);
        link.classList.add(properties.style);
      }
    },
  },
  "Info Card": {
    innerHTML: `
      <div class="info-card bg-white shadow-lg rounded-lg overflow-hidden pointer-events-none w-full h-full flex flex-col">
        <div class="header bg-blue-500 p-4">
          <h3 class="font-bold text-xl text-white">Exciting News!</h3>
        </div>
        <div class="content p-6 flex-grow">
          <p class="text-gray-700 leading-relaxed">We're thrilled to announce our latest feature that will revolutionize your workflow. Stay tuned for more updates!</p>
        </div>
      </div>
    `,
    category: "Text Elements",
    minWidth: "250px",
    minHeight: "200px",
    width: "400px",
    height: "300px",
    resize: "both",
    icon: "info-circle",
    configOptions: [
      { name: "title", type: "text", label: "Card Title" },
      { name: "content", type: "textarea", label: "Card Content" },
      {
        name: "style",
        type: "custom",
        label: "Visual Style",
        render: (element) => {
          const container = document.createElement("div");
          container.className = "grid grid-cols-2 gap-2 mt-2";

          const styles = [
            { name: "Default", value: "default" },
            { name: "Minimal", value: "minimal" },
            { name: "Dark", value: "dark" },
            { name: "Colorful", value: "colorful" },
          ];

          const stylePreview = {
            default: "bg-white shadow-lg rounded-lg",
            minimal: "bg-gray-100 border border-gray-300 rounded",
            dark: "bg-gray-800 text-white rounded-lg",
            colorful:
              "bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 text-white rounded-lg",
          };

          styles.forEach((style) => {
            const button = document.createElement("button");
            button.className = `w-full p-2 ${stylePreview[style.value]} hover:opacity-80 transition-opacity duration-200`;
            button.textContent = style.name;
            button.onclick = () => {
              const card = element.querySelector(".info-card");
              card.className = `info-card ${stylePreview[style.value]} overflow-hidden pointer-events-none w-full h-full flex flex-col`;
              card.setAttribute("data-style", style.value);
              if (style.value === "dark") {
                card.querySelector(".content p").className =
                  "text-white leading-relaxed";
              } else {
                card.querySelector(".content p").className =
                  "text-gray-700 leading-relaxed";
              }
            };
            container.appendChild(button);
          });

          return container;
        },
      },
    ],
    getProperties: (element) => ({
      title: element.querySelector("h3").textContent,
      content: element.querySelector("p").textContent,
      style:
        element.querySelector(".info-card").getAttribute("data-style") ||
        "default",
    }),
    setProperties: (element, properties) => {
      if (properties.title)
        element.querySelector("h3").textContent = properties.title;
      if (properties.content)
        element.querySelector("p").textContent = properties.content;
      if (properties.style) {
        const card = element.querySelector(".info-card");
        const stylePreview = {
          default: "bg-white shadow-lg rounded-lg",
          minimal: "bg-gray-100 border border-gray-300 rounded",
          dark: "bg-gray-800 text-white rounded-lg",
          colorful:
            "bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 text-white rounded-lg",
        };
        card.className = `info-card ${stylePreview[properties.style]} overflow-hidden pointer-events-none w-full h-full flex flex-col`;
        card.setAttribute("data-style", properties.style);
        if (properties.style === "dark") {
          card.querySelector(".content p").className =
            "text-white leading-relaxed";
        } else {
          card.querySelector(".content p").className =
            "text-gray-700 leading-relaxed";
        }
      }
    },
  },
  "HTML Block": {
    innerHTML: `<div class="html-block" style="height: 100%; background: #000080 url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAEklEQVQImWNgQAX/8YDhPxIHAAh4BAP/PfnxAAAAAElFTkSuQmCC') repeat; color: #00FF00; font-family: 'Courier New', monospace; padding: 20px; border: 5px solid #00FFFF; box-shadow: 5px 5px 0 #FF00FF;"><marquee scrollamount="3" direction="left">Welcome to my awesome 90s website!</marquee>
        <blink><h1 style="text-align: center; color: #FFFF00;">HTML Block</h1></blink>
        <p style="text-shadow: 2px 2px #FF0000;">Your text goes here.</p></div>`,
    category: "Interactive Elements",
    minWidth: "200px",
    minHeight: "150px",
    width: "400px",
    height: "400px",
    resize: "both",
    icon: "code",
    elementStyles: {
      retro: `height: 100%; background: #000080 url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAEklEQVQImWNgQAX/8YDhPxIHAAh4BAP/PfnxAAAAAElFTkSuQmCC') repeat; color: #00FF00; font-family: 'Courier New', monospace; padding: 20px; border: 5px solid #00FFFF; box-shadow: 5px 5px 0 #FF00FF;`,
      modern: `height: 100%; background: #ffffff; color: #333333; font-family: 'Arial', sans-serif; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);`,
      neon: `height: 100%; background: #000000; color: #ffffff; font-family: 'Helvetica', sans-serif; padding: 20px; border: 2px solid #00ff00; box-shadow: 0 0 10px #00ff00, inset 0 0 10px #00ff00;`,
      minimalist: `height: 100%; background: #f0f0f0; color: #333333; font-family: 'Roboto', sans-serif; padding: 20px; border: 1px solid #cccccc;`,
      grunge: `height: 100%; background: #2b2b2b url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW17e3t1dXWBgYGHh4d5eXlzc3OLi4ubm5uVlZWPj4+NjY19fX2JiYl/f39ra2uRkZGZmZlpaWmXl5dvb29xcXGTk5NnZ2c8TV1mAAAAG3RSTlNAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAvEOwtAAAFVklEQVR4XpWWB67c2BUFb3g557T/hRo9/WUMZHlgr4Bg8Z4qQgQJlHI4A8SzFVrapvmTF9O7dmYRFZ60YiBhJRCgh1FYhiLAmdvX0CzTOpNE77ME0Zty/nWWzchDtiqrmQDeuv3powQ5ta2eN0FY0InkqDD73lT9c9lEzwUNqgFHs9VQce3TVClFCQrSTfOiYkVJQBmpbq2L6iZavPnAPcoU0dSw0SUTqz/GtrGuXfbyyBniKykOWQWGqwwMA7QiYAxi+IlPdqo+hYHnUt5ZPfnsHJyNiDtnpJyayNBkF6cWoYGAMY92U2hXHF/C1M8uP/ZtYdiuj26UdAdQQSXQErwSOMzt/XWRWAz5GuSBIkwG1H3FabJ2OsUOUhGC6tK4EMtJO0ttC6IBD3kM0ve0tJwMdSfjZo+EEISaeTr9P3wYrGjXqyC1krcKdhMpxEnt5JetoulscpyzhXN5FRpuPHvbeQaKxFAEB6EN+cYN6xD7RYGpXpNndMmZgM5Dcs3YSNFDHUo2LGfZuukSWyUYirJAdYbF3MfqEKmjM+I2EfhA94iG3L7uKrR+GdWD73ydlIB+6hgref1QTlmgmbM3/LeX5GI1Ux1RWpgxpLuZ2+I+IjzZ8wqE4nilvQdkUdfhzI5QDWy+kw5Wgg2pGpeEVeCCA7b85BO3F9DzxB3cdqvBzWcmzbyMiqhzuYqtHRVG2y4x+KOlnyqla8AoWWpuBoYRxzXrfKuILl6SfiWCbjxoZJUaCBj1CjH7GIaDbc9kqBY3W/Rgjda1iqQcOJu2WW+76pZC9QG7M00dffe9hNnseupFL53r8F7YHSwJWUKP2q+k7RdsxyOB11n0xtOvnW4irMMFNV4H0uqwS5ExsmP9AxbDTc9JwgneAT5vTiUSm1E7BSflSt3bfa1tv8Di3R8n3Af7MNWzs49hmauE2wP+ttrq+AsWpFG2awvsuOqbipWHgtuvuaAE+A1Z/7gC9hesnr+7wqCwG8c5yAg3AL1fm8T9AZtp/bbJGwl1pNrE7RuOX7PeMRUERVaPpEs+yqeoSmuOlokqw49pgomjLeh7icHNlG19yjs6XXOMedYm5xH2YxpV2tc0Ro2jJfxC50ApuxGob7lMsxfTbeUv07TyYxpeLucEH1gNd4IKH2LAg5TdVhlCafZvpskfncCfx8pOhJzd76bJWeYFnFciwcYfubRc12Ip/ppIhA1/mSZ/RxjFDrJC5xifFjJpY2Xl5zXdguFqYyTR1zSp1Y9p+tktDYYSNflcxI0iyO4TPBdlRcpeqjK/piF5bklq77VSEaA+z8qmJTFzIWiitbnzR794USKBUaT0NTEsVjZqLaFVqJoPN9ODG70IPbfBHKK+/q/AWR0tJzYHRULOa4MP+W/HfGadZUbfw177G7j/OGbIs8TahLyynl4X4RinF793Oz+BU0saXtUHrVBFT/DnA3ctNPoGbs4hRIjTok8i+algT1lTHi4SxFvONKNrgQFAq2/gFnWMXgwffgYMJpiKYkmW3tTg3ZQ9Jq+f8XN+A5eeUKHWvJWJ2sgJ1Sop+wwhqFVijqWaJhwtD8MNlSBeWNNWTa5Z5kPZw5+LbVT99wqTdx29lMUH4OIG/D86ruKEauBjvH5xy6um/Sfj7ei6UUVk4AIl3MyD4MSSTOFgSwsH/QJWaQ5as7ZcmgBZkzjjU1UrQ74ci1gWBCSGHtuV1H2mhSnO3Wp/3fEV5a+4wz//6qy8JxjZsmxxy5+4w9CDNJY09T072iKG0EnOS0arEYgXqYnXcYHwjTtUNAcMelOd4xpkoqiTYICWFq0JSiPfPDQdnt+4/wuqcXY47QILbgAAAABJRU5ErkJggg=='); color: #cccccc; font-family: 'Impact', sans-serif; padding: 20px; border: 3px solid #444444; box-shadow: inset 0 0 10px #000000;`,
      blank: "height: 100%;",
    },
    configOptions: [
      { name: "text", type: "textarea", label: "Text Content" },
      {
        name: "style",
        type: "custom",
        label: "Visual Style",
        render: (element) => {
          const container = document.createElement("div");
          container.className = "grid grid-cols-3 gap-2 mt-2";

          const styles = [
            { name: "Retro 90s", value: "retro" },
            { name: "Blank", value: "blank" },
            { name: "Modern Clean", value: "modern" },
            { name: "Neon Glow", value: "neon" },
            { name: "Minimalist", value: "minimalist" },
            { name: "Grunge", value: "grunge" },
          ];

          styles.forEach((style) => {
            const button = document.createElement("button");
            button.className = "w-full p-2 border rounded";
            button.textContent = style.name;
            button.style =
              elementConfigs["HTML Block"].elementStyles[style.value];
            button.onclick = () => {
              const block = element.querySelector(".html-block");
              block.setAttribute("data-style", style.value);
              block.className = "html-block";
              block.style =
                elementConfigs["HTML Block"].elementStyles[style.value];
            };
            container.appendChild(button);
          });

          return container;
        },
      },
    ],
    getProperties: (element) => ({
      text: element.querySelector(".html-block").innerHTML,
      style:
        element.querySelector(".html-block").getAttribute("data-style") ||
        "retro",
    }),
    setProperties: (element, properties) => {
      if (properties.text) {
        const sanitizedHtml = DOMPurify.sanitize(properties.text, {
          FORBID_TAGS: ["script", "frame", "object"],
          FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
        });
        element.querySelector(".html-block").innerHTML = sanitizedHtml;
      }
      if (properties.style) {
        const block = element.querySelector(".html-block");
        block.setAttribute("data-style", properties.style);
        block.className = "html-block";
        block.style =
          elementConfigs["HTML Block"].elementStyles[properties.style];
      }
    },
  },
  "Image Web Search": {
    innerHTML: `

    <div class="relative w-full h-full overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center">
      <div class="absolute inset-0 bg-yellow-300 opacity-30"></div>
      <div class="absolute inset-0 bg-blue-500 mix-blend-overlay filter blur-xl"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-20"></div>
      <div class="z-10 text-white font-bold  tracking-widest transform -rotate-2 flex flex-col items-center">
        <span class="inline-block transform hover:scale-110 transition-transform duration-300 glitch-text text-3xl ">Image</span>
        <span class="inline-block transform hover:scale-110 transition-transform duration-300 glitch-text text-sm">Click here to search</span>
      </div>
      <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-yellow-300 to-pink-500 rounded-full filter blur-xl opacity-75 "></div>
      <div class="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-purple-300 to-cyan-500 rounded-full filter blur-xl opacity-75 "></div>
      <div class="absolute bottom-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-pink-300 to-yellow-500 rounded-full filter blur-xl opacity-75 "></div>
    </div>
  `,
    category: "Media Elements",
    minWidth: "100px",
    minHeight: "100px",
    width: "300px",
    height: "300px",
    resize: "both",
    icon: "image",
    configOptions: [
      {
        name: "unsplashApiKey",
        type: "text",
        label: "Optional: Unsplash API Key",
        helpText: "How to get an API Key",
        helpLink:
          "https://unsplash.com/documentation#creating-a-developer-account",
      },
      { name: "src", type: "text", label: "Image URL" },
      {
        name: "imageSearch",
        type: "text",
        label: "Image Search at Unsplash",
        dependsOn: "unsplashApiKey",
      },
      {
        name: "imagePreview",
        type: "custom",
        label: "",
        render: (element) => {
          const previewContainer = document.createElement("div");
          previewContainer.className =
            "imagePreview mt-2 w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg";
          previewContainer.style.display = "none"; // Initially hidden

          const img = document.createElement("img");
          img.className = "max-w-full max-h-full object-contain";
          img.src = element.querySelector("img")?.src || "";
          img.alt = "Image preview";

          previewContainer.appendChild(img);
          return previewContainer;
        },
      },
    ],

    getProperties: (element) => ({
      src: element.querySelector("img")?.src || "",
      alt:
        element.querySelector("img")?.alt ||
        element.querySelector("div")?.textContent?.trim() ||
        "",
      unsplashApiKey: localStorage.getItem("unsplashApiKey") || "",
      imageSearch: element.getAttribute("data-image-search") || "",
    }),
    setProperties: (element, properties) => {
      const container = element.querySelector("div") || element;
      if (properties.src) {
        // Create or update the img element
        let img = container.querySelector("img");
        if (!img) {
          img = document.createElement("img");
          img.className = "w-full h-full object-cover pointer-events-none";
          container.innerHTML = ""; // Clear the placeholder content
          container.appendChild(img);
        }
        img.src = properties.src;
        img.alt = properties.alt || "";
      } else if (properties.alt) {
        container.textContent = properties.alt;
      }
      if (properties.unsplashApiKey) {
        localStorage.setItem("unsplashApiKey", properties.unsplashApiKey);
      }
      if (properties.imageSearch) {
        element.setAttribute("data-image-search", properties.imageSearch);
      }
    },
    onSearch: async (searchTerm, apiKey, updateImage) => {
      try {
        const response = await fetch(
          `https://api.unsplash.com/photos/random?query=${searchTerm}&client_id=${apiKey}`
        );
        const data = await response.json();
        if (data.urls && data.urls.regular) {
          updateImage(data.urls.regular);
        }
      } catch (error) {
        console.error("Error searching Unsplash:", error);
        if (previewContainer) {
          previewContainer.textContent = "Error loading image";
        }
      }
    },
    loadImage: async (element) => {
      const apiKey = localStorage.getItem("unsplashApiKey");
      const searchTerm = element.getAttribute("data-image-search");
      if (apiKey && searchTerm) {
        try {
          const response = await fetch(
            `https://api.unsplash.com/photos/random?query=${searchTerm}&client_id=${apiKey}`
          );
          const data = await response.json();
          if (data.urls && data.urls.regular) {
            element.innerHTML = `<img src="${data.urls.regular}" alt="${searchTerm}" class="w-full h-full object-cover pointer-events-none">`;
          }
        } catch (error) {
          console.error("Error loading image:", error);
        }
      }
    },
    doesApiCall: true,
  },
  Table: {
    innerHTML:
      '<table class="border-collapse border pointer-events-none w-full h-full"><tr><th class="border p-2">Header 1</th><th class="border p-2">Header 2</th></tr><tr><td class="border p-2">Cell 1</td><td class="border p-2">Cell 2</td></tr></table>',
    category: "Layout Elements",
    minWidth: "200px",
    minHeight: "100px",
    width: "400px",
    height: "300px",
    resize: "both",
    icon: "table",
    configOptions: [
      { name: "headers", type: "text", label: "Headers (comma-separated)" },
      {
        name: "rows",
        type: "textarea",
        label: "Rows (comma-separated, one row per line)",
      },
      {
        name: "alternateRowColor",
        type: "checkbox",
        label: "Alternate Row Colors",
      },
      {
        name: "alternateColor",
        type: "color",
        label: "Alternate Row Color",
      },
    ],
    getProperties: (element) => ({
      headers: Array.from(element.querySelectorAll("th"))
        .map((th) => th.textContent)
        .join(", "),
      rows: Array.from(element.querySelectorAll("tr"))
        .slice(1)
        .map((row) =>
          Array.from(row.querySelectorAll("td"))
            .map((td) => td.textContent)
            .join(", ")
        )
        .join("\n"),
      alternateRowColor: element
        .querySelector("table")
        .classList.contains("alternate-rows"),
      alternateColor: element.getAttribute("data-alternate-color") || "#f2f2f2",
    }),
    setProperties: (element, properties) => {
      const table = element.querySelector("table");
      const headers = (properties.headers || "Header 1, Header 2")
        .split(",")
        .map((h) => h.trim());
      const rows = (properties.rows || "Cell 1, Cell 2\nCell 3, Cell 4")
        .split("\n")
        .map((row) => row.split(",").map((cell) => cell.trim()));

      const alternateRowColor =
        properties.alternateRowColor !== undefined
          ? properties.alternateRowColor
          : true;
      const alternateColor = properties.alternateColor || "#f2f2f2";

      table.innerHTML = `
            <tr>${headers
              .map((h) => `<th class="border p-2">${h}</th>`)
              .join("")}</tr>
            ${rows
              .map(
                (row, index) => `
              <tr class="${
                alternateRowColor && index % 2 !== 0 ? "alternate-row" : ""
              }">
                ${row
                  .map((cell) => `<td class="border p-2">${cell}</td>`)
                  .join("")}
              </tr>
            `
              )
              .join("")}
          `;

      if (alternateRowColor) {
        table.classList.add("alternate-rows");
        element.setAttribute("data-alternate-row-color", "true");
        element.setAttribute("data-alternate-color", alternateColor);
        let style = element.querySelector("style");
        if (!style) {
          style = document.createElement("style");
          element.appendChild(style);
        }
        style.textContent = `
              #${element.id} .alternate-row {
                background-color: ${alternateColor};
              }
            `;
      } else {
        table.classList.remove("alternate-rows");
        element.setAttribute("data-alternate-row-color", "false");
        element.removeAttribute("data-alternate-color");
        const style = element.querySelector("style");
        if (style) {
          style.remove();
        }
      }
    },
  },
  List: {
    innerHTML:
      '<ul class="list-disc pl-5 pointer-events-none w-full h-full"><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>',
    category: "Layout Elements",
    minWidth: "100px",
    minHeight: "100px",
    width: "200px",
    height: "300px",
    resize: "both",
    icon: "list",
    configOptions: [
      { name: "items", type: "textarea", label: "List Items (one per line)" },
      {
        name: "type",
        type: "select",
        label: "List Type",
        options: ["unordered", "ordered"],
      },
    ],
    getProperties: (element) => ({
      items: Array.from(element.querySelectorAll("li"))
        .map((li) => li.textContent)
        .join("\n"),
      type: element.querySelector("ul") ? "unordered" : "ordered",
    }),
    setProperties: (element, properties) => {
      if (properties.items) {
        const items = properties.items.split("\n").map((item) => item.trim());
        const listType = properties.type === "ordered" ? "ol" : "ul";
        const listClass =
          properties.type === "ordered" ? "list-decimal" : "list-disc";
        element.innerHTML = `<${listType} class="${listClass} pl-5 pointer-events-none w-full h-full">
            ${items.map((item) => `<li>${item}</li>`).join("")}
          </${listType}>`;
      }
    },
  },
  "Glitter Text": {
    innerHTML:
      '<div class="glitter-text animate__animated animate__flash animate__infinite text-7xl">Glitter Text</div>',
    category: "Text Elements",
    minWidth: "150px",
    minHeight: "80px",
    width: "400px",
    height: "80px",
    resize: "horizontal",
    icon: "spray-can-sparkles",
    configOptions: [{ name: "text", type: "text", label: "Text Content" }],
    getProperties: (element) => ({
      text: element.querySelector(".glitter-text").textContent,
    }),
    setProperties: (element, properties) => {
      const glitterText = element.querySelector(".glitter-text");
      if (properties.text) glitterText.textContent = properties.text;
    },
  },
  "Marquee Banner": {
    innerHTML:
      '<marquee class="marquee-banner text-7xl">Welcome to my website!</marquee>',
    category: "Text Elements",
    minWidth: "200px",
    minHeight: "100px",
    width: "400px",
    height: "100px",
    resize: "horizontal",
    icon: "stream",
    configOptions: [
      { name: "text", type: "text", label: "Marquee Text" },
      { name: "speed", type: "number", label: "Scroll Speed" },
    ],
    getProperties: (element) => ({
      text: element.querySelector("marquee").textContent,
      speed: element.querySelector("marquee").scrollAmount,
    }),
    setProperties: (element, properties) => {
      const marquee = element.querySelector("marquee");
      if (properties.text) marquee.textContent = properties.text;
      if (properties.speed) marquee.scrollAmount = properties.speed;
    },
  },
  Gif: {
    innerHTML:
      '<img src="https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/giphy.gif" alt="Animated GIF" style="width: 100%; height: 100%; object-fit: contain;">',
    category: "Media Elements",
    minWidth: "100px",
    minHeight: "100px",
    width: "300px",
    height: "300px",
    resize: "both",
    icon: "film",
    configOptions: [
      {
        name: "giphyApiKey",
        type: "text",
        label: "Giphy API Key",
        helpText: "How to get an API Key",
        helpLink:
          "https://support.giphy.com/hc/en-us/articles/360020283431-Request-A-GIPHY-API-Key",
      },
      {
        name: "giphySearch",
        type: "text",
        label: "Search GIFs",
        dependsOn: "giphyApiKey",
      },
      {
        name: "gifGrid",
        type: "custom",
        label: "",
        dependsOn: "giphyApiKey",
      },
    ],
    getProperties: (element) => ({
      gifUrl: element.querySelector("img").src,
      giphyApiKey: element.getAttribute("data-giphy-api-key") || "",
      giphySearch: element.getAttribute("data-giphy-search") || "",
    }),
    setProperties: (element, properties) => {
      if (properties.gifUrl) {
        element.querySelector("img").src = properties.gifUrl;
      }
      if (properties.giphyApiKey) {
        element.setAttribute("data-giphy-api-key", properties.giphyApiKey);
      }
      if (properties.giphySearch) {
        element.setAttribute("data-giphy-search", properties.giphySearch);
      }
    },
    onSearch: async (searchTerm, apiKey, updateGifGrid) => {
      const gifGridLabel = document.querySelector('label[for="gifGrid"]');
      if (gifGridLabel) {
        gifGridLabel.textContent = "Loading GIFs...";
      }

      try {
        const response = await fetch(
          `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchTerm}&limit=12`
        );
        const data = await response.json();
        const gifs = data.data.map((gif) => ({
          url: gif.images.fixed_height.url,
          fullSizeUrl: gif.images.original.url,
          title: gif.title,
        }));
        updateGifGrid(gifs);

        if (gifGridLabel) {
          gifGridLabel.textContent = "Select GIF";
        }
      } catch (error) {
        console.error("Error fetching GIFs:", error);
        if (gifGridLabel) {
          gifGridLabel.textContent = "Error loading GIFs";
        }
      }
    },
    doesApiCall: true,
    loadGif: async (element) => {
      const apiKey = localStorage.getItem("giphyApiKey");
      const searchTerm = element.getAttribute("data-giphy-search");
      if (apiKey && searchTerm) {
        try {
          const response = await fetch(
            `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchTerm}&limit=1`
          );
          const data = await response.json();
          if (data.data && data.data[0]) {
            element.querySelector("img").src = data.data[0].images.original.url;
          }
        } catch (error) {
          console.error("Error loading GIF:", error);
        }
      } else if (!apiKey) {
        element.querySelector("img").src = "/path/to/placeholder-gif.gif";
      }
    },
  },
  "Music Box": {
    innerHTML: `
    <div class="music-box w-full h-full rounded-lg shadow-lg flex flex-col items-center justify-center p-4 bg-gradient-to-br from-amber-200 to-yellow-400 text-amber-800">
      <h3 class="text-xl font-bold mb-2 song-title">Music Box!</h3>
      <button id="playButton" class="play-button bg-opacity-50 hover:bg-opacity-75 font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105" data-song="starwars">
        <i class="fas fa-play mr-2"></i>Play
      </button>
    </div>
    <script>
      (function() {
        const playButton = document.currentScript.previousElementSibling.querySelector('#playButton');
        const songTitle = document.currentScript.previousElementSibling.querySelector('.song-title');
        let isPlaying = false;
        let currentAudio = null;
         
        const melodies = {
          starwars: "G4,0.4,G4,0.4,G4,0.4,E5,0.8,C5,0.8,G5,0.8,F5,0.4,E5,0.4,D5,0.4,C6,1.2,G5,0.8,F5,0.4,E5,0.4,D5,0.4,C6,1.2,G5,0.8,F5,0.4,E5,0.4,F5,0.4,D5,1.2",
          harrypotter: "B3,0.4,E4,0.6,G4,0.4,F#4,0.8,E4,1.2,B4,0.4,A4,0.6,F#4,1.4,E4,0.4,G4,0.4,F#4,0.8,D4,0.8,F4,0.4,B3,1.4",
          jamesbond: "E4,0.1,F#4,0.2,F#4,0.2,F#4,0.2,F#4,0.4,F#4,0.2,F#4,0.2,F#4,0.2,G#4,0.2,G#4,0.2,G#4,0.2,G#4,0.4,G#4,0.2,G#4,0.2,G#4,0.2,F#4,0.8,F#4,0.2,F#4,0.2,F#4,0.4,F#4,0.2,F#4,0.2,E4,0.8,E4,0.2,E4,0.2,E4,0.4,E4,0.2,E4,0.2",
          indianajones: "E4,0.4,F4,0.4,G4,0.4,C5,1.2,B4,0.4,A4,0.4,G4,0.4,F4,0.4,E4,0.4,C4,1.2,E4,0.4,F4,0.4,G4,0.4,C5,1.2,B4,0.4,A4,0.4,G4,0.4,F4,0.4,E4,0.4,C4,1.2",
          jurassicpark: "C4,0.8,D4,0.4,C4,0.4,G4,1.4,F4,1.4,C4,0.8,D4,0.4,C4,0.4,A#4,1.4,A4,0.8,G4,0.8,C5,1.4,C4,1.4",
          pirates: "D4,0.4,D5,0.4,D5,0.4,G4,0.8,A4,0.8,B4,0.4,C5,0.4,D5,0.4,E5,0.4,F#5,0.8,G5,0.8,A5,0.8,D5,0.8,C5,0.8,B4,0.4,A4,0.4",
          mario: "E5,0.3,E5,0.3,0,0.3,E5,0.3,0,0.3,C5,0.3,E5,0.3,G5,0.6,0,0.6,G4,0.3,0,0.3,C5,0.3,G4,0.3,E4,0.3,0,0.3,A4,0.3,B4,0.3,Bb4,0.3,A4,0.6",
          zelda: "G4,0.4,A4,0.4,B4,0.4,C5,1.2,D5,0.4,E5,0.4,F5,0.4,G5,1.2,G5,0.4,F5,0.4,E5,0.4,D5,0.4,C5,0.4,B4,0.4,A4,0.4,G4,1.4",
          tetris: "E5,0.3,B4,0.3,C5,0.3,D5,0.3,C5,0.3,B4,0.3,A4,0.3,A4,0.3,C5,0.3,E5,0.3,D5,0.3,C5,0.3,B4,0.3,C5,0.3,D5,0.3,E5,0.3,C5,0.3,A4,0.3,A4,0.3"          
      };

        function playMelody(notes) {
          if (currentAudio) {
            currentAudio.pause();
          }

          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.type = "sine";
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);

          const noteFrequencies = {
            C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
            G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25,
            D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99,
            A5: 880.0, B5: 987.77, C6: 1046.5, "F#4": 369.99,
            "G#4": 415.3, "A#4": 466.16
          };

          let time = audioContext.currentTime;
          const notesArray = notes.split(',');

          for (let i = 0; i < notesArray.length; i += 2) {
            const note = notesArray[i].trim();
            const duration = parseFloat(notesArray[i + 1]);
            const frequency = noteFrequencies[note];

            if (frequency) {
              oscillator.frequency.setValueAtTime(frequency, time);
              gainNode.gain.setValueAtTime(0, time);
              gainNode.gain.linearRampToValueAtTime(0.5, time + 0.01);
              gainNode.gain.linearRampToValueAtTime(0, time + duration - 0.01);
              time += duration;
            }
          }

          oscillator.start();
          oscillator.stop(time);

          currentAudio = {
            pause: () => {
              oscillator.stop();
              audioContext.close();
            },
          };

          return time;
        }

        playButton.addEventListener('click', () => {
          const selectedSong = playButton.getAttribute('data-song');
          const customMelody = playButton.getAttribute('data-custom-melody');
          
          if (isPlaying) {
            if (currentAudio) {
              currentAudio.pause();
            }
            playButton.innerHTML = '<i class="fas fa-play mr-2"></i>Play';
            isPlaying = false;
          } else {
            let duration;
            if (selectedSong && melodies[selectedSong]) {
              duration = playMelody(melodies[selectedSong]);
            } else if (customMelody) {
              duration = playMelody(customMelody);
            } else {
              alert("No song selected. Please configure the Music Box.");
              return;
            }
            playButton.innerHTML = '<i class="fas fa-stop mr-2"></i>Stop';
            isPlaying = true;
            
            setTimeout(() => {
              playButton.innerHTML = '<i class="fas fa-play mr-2"></i>Play';
              isPlaying = false;
            }, duration * 1000);
          }
        });
      })();
    </script>
  `,
    category: "Media Elements",
    minWidth: "200px",
    minHeight: "150px",
    width: "250px",
    height: "200px",
    resize: "both",
    icon: "music",
    configOptions: [
      {
        name: "song",
        type: "select",
        label: "Choose a song",
        options: [
          { value: "starwars", label: "Star Wars" },
          { value: "harrypotter", label: "Harry Potter" },
          { value: "jamesbond", label: "James Bond" },
          { value: "indianajones", label: "Indiana Jones" },
          { value: "jurassicpark", label: "Jurassic Park" },
          { value: "pirates", label: "Pirates of the Caribbean" },
          { value: "mario", label: "Super Mario Bros" },
          { value: "zelda", label: "Zelda Theme" },
          { value: "tetris", label: "Tetris" },
        ],
      },
      {
        name: "customMelody",
        type: "text",
        label:
          "Custom Melody (format: note,duration,note,duration, e.g., C4,0.3,D4,0.6,E4,0.3)",
      },
      {
        name: "customTitle",
        type: "text",
        label: "Custom Title",
      },
      {
        name: "style",
        type: "custom",
        label: "Music Box Style",
        render: (element) => {
          const container = document.createElement("div");
          container.className = "grid grid-cols-3 gap-2 mt-2";

          const styles = [
            {
              name: "Classic",
              classes:
                "bg-gradient-to-br from-amber-200 to-yellow-400 text-amber-800",
            },
            {
              name: "Neon",
              classes: "bg-black text-neon-green border-2 border-neon-green",
            },
            {
              name: "Retro",
              classes:
                "bg-purple-700 text-yellow-300 border-2 border-yellow-300",
            },
            {
              name: "Minimalist",
              classes: "bg-gray-100 text-gray-800 border border-gray-300",
            },
            {
              name: "Futuristic",
              classes:
                "bg-gradient-to-r from-blue-500 to-purple-600 text-white",
            },
          ];

          styles.forEach((style) => {
            const button = document.createElement("button");
            button.className = `w-full p-2 rounded ${style.classes}`;
            button.textContent = style.name;
            button.onclick = () => {
              const musicBox = element.querySelector(".music-box");
              const playButton = element.querySelector("#playButton");
              musicBox.className = `music-box w-full h-full rounded-lg shadow-lg flex flex-col items-center justify-center p-4 ${style.classes}`;
              playButton.className = `play-button ${style.classes.includes("text-neon-green") ? "text-neon-green" : "text-inherit"} bg-opacity-50 hover:bg-opacity-75 font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105`;
              element.setAttribute("data-style", style.name);
            };
            container.appendChild(button);
          });

          return container;
        },
      },
    ],
    getProperties: (element) => ({
      song:
        element.querySelector("#playButton").getAttribute("data-song") ||
        "starwars",
      customMelody:
        element
          .querySelector("#playButton")
          .getAttribute("data-custom-melody") || "",
      customTitle: element.querySelector(".song-title").textContent,
      style: element.getAttribute("data-style") || "Classic",
    }),
    setProperties: (element, properties) => {
      const playButton = element.querySelector("#playButton");
      const songTitle = element.querySelector(".song-title");
      const musicBox = element.querySelector(".music-box");

      if (properties.song) {
        playButton.setAttribute("data-song", properties.song);
        songTitle.textContent =
          properties.song.charAt(0).toUpperCase() +
          properties.song
            .slice(1)
            .replace(/([A-Z])/g, " $1")
            .trim() +
          " Theme";
      }
      if (properties.customMelody) {
        playButton.setAttribute("data-custom-melody", properties.customMelody);
      }
      if (properties.customTitle) {
        songTitle.textContent = properties.customTitle;
      }
      if (properties.style) {
        const styles = {
          Classic:
            "bg-gradient-to-br from-amber-200 to-yellow-400 text-amber-800",
          Neon: "bg-black text-neon-green border-2 border-neon-green",
          Retro: "bg-purple-700 text-yellow-300 border-2 border-yellow-300",
          Minimalist: "bg-gray-100 text-gray-800 border border-gray-300",
          Futuristic: "bg-gradient-to-r from-blue-500 to-purple-600 text-white",
        };
        const styleClasses = styles[properties.style];
        musicBox.className = `music-box w-full h-full rounded-lg shadow-lg flex flex-col items-center justify-center p-4 ${styleClasses}`;
        playButton.className = `play-button ${styleClasses.includes("text-neon-green") ? "text-neon-green" : "text-inherit"} bg-opacity-50 hover:bg-opacity-75 font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105`;
        element.setAttribute("data-style", properties.style);
      }
    },
  },
  Header: {
    innerHTML: '<h1 class="header text-6xl">Header Text</h1>',
    category: "Text Elements",
    minWidth: "150px",
    minHeight: "50px",
    width: "400px",
    height: "100px",
    resize: "horizontal",
    icon: "heading",
    configOptions: [
      { name: "text", type: "text", label: "Header Text" },
      {
        name: "level",
        type: "select",
        label: "Header Size",
        options: [
          { value: "text-xs", label: "Sooo tiny!" },
          { value: "text-sm", label: "Supersmall" },
          { value: "text-base", label: "Small" },
          { value: "text-xl", label: "OKish" },
          { value: "text-3xl", label: "Big" },
          { value: "text-6xl", label: "Huge" },
          { value: "text-9xl", label: "Giantastic" },
        ],
      },
    ],
    getProperties: (element) => ({
      text: element.querySelector(".header").textContent,
      level: element.querySelector(".header").classList[1] || "text-6xl",
    }),
    setProperties: (element, properties) => {
      const header = element.querySelector(".header");
      if (properties.text) header.textContent = properties.text;
      if (properties.level) {
        header.className = `header ${properties.level}`;
      }
    },
  },
  "Alert Box": {
    innerHTML:
      '<div class="alert-box alert-warning" role="alert">This is a warning alert!</div>',
    category: "Layout Elements",
    minWidth: "100px",
    minHeight: "50px",
    width: "300px",
    height: "80px",
    resize: "horizontal",
    icon: "exclamation-triangle",
    configOptions: [
      { name: "text", type: "text", label: "Alert Text" },
      {
        name: "type",
        type: "select",
        label: "Alert Type",
        options: ["info", "success", "warning", "error"],
      },
    ],
    getProperties: (element) => ({
      text: element.querySelector(".alert-box").textContent,
      type:
        element.querySelector(".alert-box").getAttribute("data-type") ||
        "warning",
    }),
    setProperties: (element, properties) => {
      const alertBox = element.querySelector(".alert-box");
      if (properties.text) alertBox.textContent = properties.text;
      if (properties.type) {
        alertBox.setAttribute("data-type", properties.type);
        alertBox.className = `alert-box alert-${properties.type}`;
      }
    },
  },
  "AI Image": {
    innerHTML: `
    <div class="relative w-full h-full overflow-hidden bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center">
      <div class="absolute inset-0 bg-yellow-300 opacity-30"></div>
      <div class="absolute inset-0 bg-blue-500 mix-blend-overlay filter blur-xl"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-20"></div>
      <div class="z-10 text-white font-bold  tracking-widest transform -rotate-2 flex flex-col items-center">
        <span class="inline-block transform hover:scale-110 transition-transform duration-300 glitch-text text-3xl ">AI Image</span>
        <span class="inline-block transform hover:scale-110 transition-transform duration-300 glitch-text text-sm">Click here to generate</span>
      </div>
      <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-yellow-300 to-pink-500 rounded-full filter blur-xl opacity-75 "></div>
      <div class="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-purple-300 to-cyan-500 rounded-full filter blur-xl opacity-75 "></div>
      <div class="absolute bottom-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-pink-300 to-yellow-500 rounded-full filter blur-xl opacity-75 "></div>
    </div>
  `,
    category: "Media Elements",
    minWidth: "100px",
    minHeight: "100px",
    width: "300px",
    height: "300px",
    resize: "both",
    icon: "robot",
    configOptions: [
      {
        name: "openaiApiKey",
        type: "text",
        label: "OpenAI API Key",
        helpText: "How to get an API Key",
        helpLink: "https://platform.openai.com/account/api-keys",
      },
      {
        name: "imagePrompt",
        type: "textarea",
        label: "Image Prompt",
        dependsOn: "openaiApiKey",
      },
      {
        name: "generateButton",
        type: "button",
        label: "Generate Image",
        dependsOn: "openaiApiKey",
      },
    ],
    getProperties: (element) => ({
      imageUrl: element.querySelector("img")?.src || "",
      openaiApiKey: element.getAttribute("data-openai-api-key") || "",
    }),
    setProperties: (element, properties) => {
      const container = element.querySelector("div") || element;
      if (properties.imageUrl) {
        // Create or update the img element
        let img = container.querySelector("img");
        if (!img) {
          img = document.createElement("img");
          img.className = "w-full h-full object-cover pointer-events-none";
          container.innerHTML = ""; // Clear the placeholder content
          container.appendChild(img);
        }
        img.src = properties.imageUrl;
        img.alt = "AI Generated Image";
      }
      if (properties.openaiApiKey) {
        element.setAttribute("data-openai-api-key", properties.openaiApiKey);
      }
    },
    onGenerate: async (prompt, apiKey, updateAiImage) => {
      try {
        const response = await fetch(
          "https://api.openai.com/v1/images/generations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              prompt: prompt,
              n: 1,
              size: "512x512",
            }),
          }
        );
        const data = await response.json();
        if (data.data && data.data[0] && data.data[0].url) {
          updateAiImage(data.data[0].url);
        } else {
          console.error("Failed to generate image:", data);
          alert(
            "Failed to generate image. Please check your API key and try again."
          );
        }
      } catch (error) {
        console.error("Error generating image:", error);
        alert(
          "An error occurred while generating the image. Please try again."
        );
      }
    },
    doesApiCall: true,
  },
  "Video Player": {
    innerHTML: `
      <div class="video-container w-full h-full relative">
        <iframe class="w-full h-full" src="" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        <div class="placeholder absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500">
          <span class="text-white text-xl font-bold">Enter a video URL</span>
        </div>
      </div>
    `,
    category: "Media Elements",
    minWidth: "300px",
    minHeight: "169px",
    width: "560px",
    height: "315px",
    resize: "both",
    icon: "video",
    configOptions: [
      { name: "videoUrl", type: "text", label: "Video URL (YouTube or Vimeo)" },
    ],
    getProperties: (element) => ({
      videoUrl: element.querySelector("iframe").src,
    }),
    setProperties: (element, properties) => {
      if (properties.videoUrl) {
        let embedUrl = properties.videoUrl;
        if (
          properties.videoUrl.includes("youtube.com") ||
          properties.videoUrl.includes("youtu.be")
        ) {
          const videoId =
            properties.videoUrl.split("v=")[1] ||
            properties.videoUrl.split("/").pop();
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (properties.videoUrl.includes("vimeo.com")) {
          const videoId = properties.videoUrl.split("/").pop();
          embedUrl = `https://player.vimeo.com/video/${videoId}`;
        }
        element.querySelector("iframe").src = embedUrl;
        element.querySelector(".placeholder").style.display = "none";
      } else {
        element.querySelector(".placeholder").style.display = "flex";
      }
    },
  },
  "Website Loader": {
    innerHTML: `
      <div class="website-container w-full h-full relative">
        <iframe class="w-full h-full" src="" frameborder="0"></iframe>
        <div class="placeholder absolute inset-0 flex items-center justify-center bg-gradient-to-br from-teal-400 via-purple-500 to-orange-500 text-white">
          <span class="text-xl font-semibold">Enter a website URL to load</span>
        </div>
      </div>
    `,
    category: "Interactive Elements",
    minWidth: "300px",
    minHeight: "300px",
    width: "600px",
    height: "400px",
    resize: "both",
    icon: "globe",
    configOptions: [{ name: "websiteUrl", type: "text", label: "Website URL" }],
    getProperties: (element) => ({
      websiteUrl: element.querySelector("iframe").src,
    }),
    setProperties: (element, properties) => {
      if (properties.websiteUrl) {
        element.querySelector("iframe").src = properties.websiteUrl;
        element.querySelector(".placeholder").style.display = "none";
      } else {
        element.querySelector(".placeholder").style.display = "flex";
      }
    },
  },
  "Weather Widget": {
    innerHTML: `
      <div class="weather-widget w-full h-full p-4 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-lg">
        <div class="placeholder flex items-center justify-center h-full">
          <span class="text-xl font-semibold">Enter a location to load weather data</span>
        </div>
        <div class="weather-data hidden">
          <div class="location text-xl font-bold mb-2"></div>
          <div class="temperature text-4xl font-bold mb-2"></div>
          <div class="description text-lg"></div>
        </div>
      </div>
    `,
    category: "Interactive Elements",
    minWidth: "200px",
    minHeight: "150px",
    width: "300px",
    height: "200px",
    resize: "both",
    icon: "cloud-sun",
    configOptions: [
      { name: "location", type: "text", label: "Location (City, Country)" },
    ],
    getProperties: (element) => ({
      location: element.getAttribute("data-location") || "",
    }),
    setProperties: (element, properties) => {
      if (properties.location) {
        element.setAttribute("data-location", properties.location);
        element.querySelector(".placeholder").classList.add("hidden");
        element.querySelector(".weather-data").classList.remove("hidden");
        fetchWeather(element, properties.location);
      } else {
        element.querySelector(".placeholder").classList.remove("hidden");
        element.querySelector(".weather-data").classList.add("hidden");
      }
    },
  },
  Emoji: {
    innerHTML: `
      <div class="emoji-container w-full h-full flex items-center justify-center text-center">
        <span class="emoji-display" style="font-size: 700%; line-height: 1;">🙂</span>
      </div>
    `,
    category: "Text Elements",
    minWidth: "50px",
    minHeight: "50px",
    width: "130px",
    height: "130px",
    resize: "both",
    icon: "smile",
    configOptions: [
      {
        name: "emojiPicker",
        type: "custom",
        label: "Choose Emoji",
        render: (element) => {
          const container = document.createElement("div");
          container.className = "emoji-picker-container mt-2";

          const picker = new Picker({
            onEmojiSelect: (emoji) => {
              const emojiDisplay = element.querySelector(".emoji-display");
              if (emojiDisplay) {
                emojiDisplay.textContent = emoji.native;
                // Close the config window
                const configModal =
                  document.getElementById("elementConfigModal");
                if (configModal) {
                  configModal.classList.add("hidden");
                }
                // Trigger a custom event to notify that the element has been updated
                const event = new CustomEvent("elementUpdated", {
                  detail: { element },
                });
                document.dispatchEvent(event);
              }
            },
            theme: "light",
            set: "apple",
          });

          container.appendChild(picker);
          return container;
        },
      },
    ],
    getProperties: (element) => ({
      emoji: element.querySelector(".emoji-display").textContent,
    }),
    setProperties: (element, properties) => {
      if (properties.emoji) {
        const emojiDisplay = element.querySelector(".emoji-display");
        if (emojiDisplay) {
          emojiDisplay.textContent = properties.emoji;
        }
      }
    },
    onResize: (element) => {
      const emojiDisplay = element.querySelector(".emoji-display");
      if (emojiDisplay) {
        const containerWidth = element.offsetWidth;
        const containerHeight = element.offsetHeight;
        const fontSize = Math.min(containerWidth, containerHeight) * 0.8; // 80% of the smaller dimension
        emojiDisplay.style.fontSize = `${fontSize}px`;
      }
    },
  },
};

// Helper function for Weather Widget
async function fetchWeather(element, location) {
  const apiUrl = `https://wttr.in/${encodeURIComponent(location)}?format=j1`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const locationElement = element.querySelector(".location");
    const temperatureElement = element.querySelector(".temperature");
    const descriptionElement = element.querySelector(".description");

    locationElement.textContent = data.nearest_area[0].areaName[0].value;
    temperatureElement.textContent = `${data.current_condition[0].temp_C}°C`;
    descriptionElement.textContent =
      data.current_condition[0].weatherDesc[0].value;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    element.querySelector(".weather-widget").textContent =
      "Failed to load weather data";
  }
}

export default elementConfigs;
