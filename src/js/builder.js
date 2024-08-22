import { gsap } from "gsap";
import elementConfigs from "./elements";
import { DragDropManager } from "./dragDropManager";

const version = "0.4.1";

document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("versionNumber").textContent = `v${version}`;
  const draggableElements = document.querySelectorAll('[draggable="true"]');
  const confirmModal = document.getElementById("confirmModal");
  const removeElementButton = document.getElementById("removeElement");
  const cancelRemoveButton = document.getElementById("cancelRemove");
  const confirmRemoveButton = document.getElementById("confirmRemove");
  // Configuration related variables
  const webTitle = document.getElementById("webTitle");
  const configModal = document.getElementById("configModal");
  const elementConfigModal = document.getElementById("elementConfigModal");
  const configForm = document.getElementById("configForm");
  const cancelConfig = document.getElementById("cancelConfig");
  const gridSizeInput = document.getElementById("gridSizeInput");
  const gridSizeValue = document.getElementById("gridSizeValue");
  const newWebsite = document.getElementById("newWebsite");
  const newWebsiteModal = document.getElementById("newWebsiteModal");
  const closeNewWebsiteModal = document.getElementById("closeNewWebsiteModal");
  const bgConfigButton = document.getElementById("bgConfigButton");
  const bgConfigModal = document.getElementById("bgConfigModal");
  const bgOptions = document.getElementById("bgOptions");
  const cancelBgConfig = document.getElementById("cancelBgConfig");
  const backgrounds = [
    { name: "Bg 1", url: 'url("https://websites.glitchgen.ai/bgs/1.gif")' },
    { name: "Bg 2", url: 'url("https://websites.glitchgen.ai/bgs/2.gif")' },
    { name: "Bg 3", url: 'url("https://websites.glitchgen.ai/bgs/3.gif")' },
    { name: "Bg 4", url: 'url("https://websites.glitchgen.ai/bgs/4.gif")' },
    { name: "Bg 5", url: 'url("https://websites.glitchgen.ai/bgs/5.gif")' },
    { name: "Bg 6", url: 'url("https://websites.glitchgen.ai/bgs/6.gif")' },
  ];

  const INTERACTION_DELAY = 200;

  // Save and Load functionality
  const saveWeb = document.getElementById("saveWeb");
  const loadWeb = document.getElementById("loadWeb");
  const loadModal = document.getElementById("loadModal");
  const cancelLoad = document.getElementById("cancelLoad");
  const fileInput = document.getElementById("fileInput");

  let fontSelect = document.getElementById("fontSelect");
  let GRID_SIZE = 20;
  let dragDropManager;
  let elementToRemove = null;
  let isDragging = false;
  let startX, startY, initialLeft, initialTop;
  let highestZIndex = 1000;
  let hasUnsavedChanges = false;
  let isResizing = false;
  let dropZoneInitialWidth, dropZoneInitialHeight;
  let currentConfigElement = null;
  let lastInteractionTime = 0;
  let justDropped = false;
  let justResized = false;
  let elementCounter = 0;

  const dropZone = document.getElementById("drop-zone");
  dragDropManager = new DragDropManager(
    dropZone,
    GRID_SIZE,
    assignHighestZIndex
  );
  dragDropManager.initializeExistingElements();

  /**
   * Event listener for opening the new website modal
   * Opens the modal for creating a new website when the newWebsite button is clicked
   */
  newWebsite.addEventListener("click", () =>
    modalSystem.openModal("newWebsiteModal")
  );

  /**
   * Event listener for closing the new website modal
   * Closes the modal when the closeNewWebsiteModal button is clicked
   */
  closeNewWebsiteModal.addEventListener("click", () =>
    modalSystem.closeModal()
  );

  /**
   * Creates a new website based on the selected template
   * @param {string} template - The template to use for the new website ("blank" or a specific template name)
   */
  window.createNewWebsite = function (template) {
    if (template === "blank") {
      // Clear current app
      while (dropZone.firstChild) {
        dropZone.removeChild(dropZone.firstChild);
      }
      // Reset to default settings
      webTitle.textContent = "Your Website";
      GRID_SIZE = 20;
      document.getElementById("fontSelect").value = "Roboto";
      document.getElementById("textColorInput").value = "#000000";
      dropZone.style.backgroundImage = "none";
      updateTextColor("#000000");
      updateFont("Roboto");
      modalSystem.closeModal();
    } else {
      if (isRunningLocalServer()) {
        // Load template
        fetch(`./templates/${template}.glitchGen`)
          .then((response) => response.json())
          .then((data) => {
            loadWebFromFile(
              new Blob([JSON.stringify(data)], { type: "application/json" })
            );
            modalSystem.closeModal();
          })
          .catch((error) => console.error("Error loading template:", error));
      } else {
        // Show message for non-server environment
        const messageContainer = document.getElementById("templateMessage");
        messageContainer.innerHTML = `
          <p>Since you're not running a web server, the template can't be loaded automatically. 
          To use this template, please follow these steps:</p>
          <ol class="list-decimal list-inside mt-2">
            <li>Click on "Load Website" in the sidebar</li>
            <li>Navigate to the "templates" folder</li>
            <li>Select the "${template}.glitchGen" file</li>
          </ol>
        `;
        messageContainer.classList.remove("hidden");
      }
    }
  };

  function isRunningLocalServer() {
    return window.location.protocol === 'http:' || window.location.protocol === 'https:';
  }

  /**
   * Generates a unique ID for a new element
   * @returns {string} A unique element ID
   */
  function generateUniqueId() {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    elementCounter++;
    return `element-${result}`;
  }

  // Load web from file
  saveWeb.addEventListener("click", saveCurrentApp);
  fileInput.addEventListener("change", handleFileSelect);

  /**
   * Event listener for opening element configuration
   */
  dropZone.addEventListener("openElementConfig", (event) => {
    openElementConfig(event.detail.element);
  });

  /**
   * Event listener for drag enter on drop zone
   */
  dropZone.addEventListener("dragenter", (e) => {
    const elementType = e.dataTransfer.getData("text/plain");
    if (elementType) {
      const preview = document.querySelector(".drag-preview");
      if (preview) {
        preview.style.display = "block";
      } else {
        const newPreview = createDragPreview(elementType);
        newPreview.classList.add("drag-preview");
        updateDragPreview(newPreview, e.clientX, e.clientY);
      }
    }
  });

  /**
   * Event listener for drag leave on drop zone
   */
  dropZone.addEventListener("dragleave", (e) => {
    if (!dropZone.contains(e.relatedTarget)) {
      const preview = document.querySelector(".drag-preview");
      if (preview) {
        preview.style.display = "none";
      }
    }
  });

  /**
   * Event listener for drag over on drop zone
   */
  dropZone.addEventListener("dragover", (e) => {
    const preview = document.querySelector(".drag-preview");
    if (preview) {
      updateDragPreview(preview, e.clientX, e.clientY);
    }
  });

  /**
   * Event listener for drop on drop zone
   */
  dropZone.addEventListener("drop", (e) => {
    const preview = document.querySelector(".drag-preview");
    if (preview) {
      removeDragPreview(preview);
    }
  });

  /**
   * Modal system object for managing modal dialogs.
   * Handles opening, closing, and z-index management of modals.
   * @type {Object}
   */
  const modalSystem = {
    modalStack: [],

    /**
     * Opens a modal by its ID, removes the 'hidden' class, and updates z-index.
     * @param {string} modalId - The ID of the modal to open.
     */
    openModal: function (modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove("hidden");
        this.modalStack.push(modal);
        this.updateModalZIndex();
      }
    },

    /**
     * Closes the top-most modal in the stack and adds the 'hidden' class.
     */
    closeModal: function () {
      if (this.modalStack.length > 0) {
        const modal = this.modalStack.pop();
        modal.classList.add("hidden");
      }
    },

    /**
     * Updates the z-index of all open modals to ensure proper stacking order.
     */
    updateModalZIndex: function () {
      const elements = document.querySelectorAll(".draggable-element");
      const maxElementZIndex = Math.max(
        0,
        ...Array.from(elements).map((el) => parseInt(el.style.zIndex) || 0)
      );
      this.modalStack.forEach((modal, index) => {
        modal.style.zIndex = (maxElementZIndex + index + 1).toString();
      });
    },
  };

  /**
   * Event listener for closing modal with Escape key
   */
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      modalSystem.closeModal();
    }
  });

  /**
   * Event listener for closing modal when clicking outside
   */
  document.addEventListener("click", function (event) {
    if (modalSystem.modalStack.length > 0) {
      const topModal =
        modalSystem.modalStack[modalSystem.modalStack.length - 1];
      if (event.target === topModal) {
        modalSystem.closeModal();
      }
    }
  });

  /**
   * Event listener for opening configuration modal
   */
  webTitle.addEventListener("click", () => {
    document.getElementById("webTitleInput").value = webTitle.textContent;
    document.getElementById("gridSizeInput").value = GRID_SIZE;
    modalSystem.openModal("configModal");
  });

  /**
   * Event listener for canceling configuration
   */
  cancelConfig.addEventListener("click", () => {
    modalSystem.closeModal();
  });

  /**
   * Event listener for opening load modal
   */
  loadWeb.addEventListener("click", () => modalSystem.openModal("loadModal"));

  /**
   * Event listener for canceling load
   */
  cancelLoad.addEventListener("click", () => modalSystem.closeModal());

  /**
   * Event listener for updating font preview in configuration modal
   */
  fontSelect.addEventListener("change", function () {
    this.style.fontFamily = this.value;
  });

  /**
   * Event listener for updating grid size value in configuration modal
   */
  gridSizeInput.addEventListener("input", function () {
    gridSizeValue.textContent = this.value + "px";
  });

  /**
   * Event listener for saving configuration
   */
  configForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Update web  title
    webTitle.textContent = document.getElementById("webTitleInput").value;

    // Update text color
    updateTextColor(document.getElementById("textColorInput").value);

    // Update grid size
    GRID_SIZE = parseInt(document.getElementById("gridSizeInput").value);

    // Update dragDropManager
    dragDropManager.gridSize = GRID_SIZE;

    // Update font
    updateFont(document.getElementById("fontSelect").value);

    // Close modal
    configModal.classList.add("hidden");
  });

  /**
   * Event listener for opening background configuration modal
   */
  bgConfigButton.addEventListener("click", () =>
    modalSystem.openModal("bgConfigModal")
  );

  /**
   * Event listener for canceling background configuration
   */
  cancelBgConfig.addEventListener("click", () => modalSystem.closeModal());

  /**
   * Populates the background options in the background configuration modal.
   * This function creates and adds clickable background options to the modal,
   * including a "No background" option and other predefined backgrounds.
   * When an option is clicked, it updates the dropZone's background and closes the modal.
   */
  function populateBgOptions() {
    bgOptions.innerHTML = "";

    // Add "No background" option
    const noBgElement = document.createElement("div");
    noBgElement.className =
      "bg-option cursor-pointer h-32 rounded-lg shadow-md flex items-center justify-center";
    noBgElement.style.backgroundColor = "#ffffff";
    noBgElement.innerHTML = '<span class="text-gray-700">No background</span>';
    noBgElement.addEventListener("click", () => {
      dropZone.style.backgroundImage = "none";
      modalSystem.closeModal();
      togglePlaceholder();
    });
    bgOptions.appendChild(noBgElement);

    // Add other background options
    backgrounds.forEach((bg) => {
      const bgElement = document.createElement("div");
      bgElement.className =
        "bg-option cursor-pointer h-32 rounded-lg shadow-md";
      bgElement.style.backgroundImage = bg.url;
      bgElement.style.backgroundSize = "cover";
      bgElement.style.backgroundPosition = "center";
      bgElement.addEventListener("click", () => {
        dropZone.style.backgroundImage = bg.url;
        modalSystem.closeModal();
        togglePlaceholder();
      });
      bgOptions.appendChild(bgElement);
    });
  }

  /**
   * Event listener for drag start on draggable elements
   */
  draggableElements.forEach((elem) => {
    elem.addEventListener("dragstart", dragStart);
  });

  /**
   * Event listener for drag over on drop zone
   */
  dropZone.addEventListener("dragover", dragOver);

  /**
   * Event listener for drop on drop zone
   */
  dropZone.addEventListener("drop", drop);

  /**
   * Event listener for drop on drop zone
   * Marks changes as unsaved when an element is dropped
   */
  dropZone.addEventListener("drop", markUnsavedChanges);

  /**
   * Event listener for drag end on drop zone
   * Marks changes as unsaved when dragging ends
   */
  dropZone.addEventListener("dragend", markUnsavedChanges);

  /**
   * Event listener for mouseup to mark unsaved changes
   */
  document.addEventListener("mouseup", function (e) {
    if (isDragging || isResizing) {
      markUnsavedChanges();
    }
  });

  configForm.addEventListener("submit", markUnsavedChanges);

  /**
   * Event listener for saving web to clear unsaved changes flag
   */
  saveWeb.addEventListener("click", () => {
    hasUnsavedChanges = false;
  });

  /**
   * Event listener for exporting web
   */
  document.getElementById("exportWeb").addEventListener("click", exportWeb);

  /**
   * Event listener for input changes on elements
   */
  dropZone.addEventListener("input", function (e) {
    const element = e.target.closest(".draggable-element");
    if (element) {
      markUnsavedChanges();
      dispatchElementAddedEvent(element.id); // Dispatch event with element ID
    }
  });

  /**
   * Event listener for changes on elements
   */
  dropZone.addEventListener("change", function (e) {
    const element = e.target.closest(".draggable-element");
    if (element) {
      markUnsavedChanges();
      dispatchElementAddedEvent(element.id); // Dispatch event with element ID
    }
  });
  /**
   * Event listener for when a new element is added to the drop zone
   * Marks changes as unsaved when an element is added
   */
  dropZone.addEventListener("elementadded", markUnsavedChanges);

  /**
   * Event listener for when an element is removed from the drop zone
   * Marks changes as unsaved when an element is removed
   */
  dropZone.addEventListener("elementremoved", markUnsavedChanges);

  /**
   * Populates the elements list in the sidebar with available elements grouped by category.
   * This function creates draggable list items for each element type and adds them to their respective category lists.
   */
  function populateElementsList() {
    const categories = {
      "Text Elements": document.getElementById("textElements"),
      "Media Elements": document.getElementById("mediaElements"),
      "Interactive Elements": document.getElementById("interactiveElements"),
      "Layout Elements": document.getElementById("layoutElements"),
    };

    Object.entries(elementConfigs).forEach(([elementType, config]) => {
      const categoryList = categories[config.category];
      if (categoryList) {
        const li = document.createElement("li");
        li.innerHTML = `
          <i class="mt-1 fas fa-${config.icon}"></i>
          <span class="flex-grow">${elementType}</span>
        `;
        li.setAttribute("draggable", "true");
        li.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", elementType);
          createDragPreview(e, elementType);
        });
        categoryList.appendChild(li);
      }
    });
  }

  /**
   * Handles the start of a drag operation for elements in the sidebar.
   * @param {DragEvent} e - The drag event object.
   */
  function dragStart(e) {
    if (!e.target.classList.contains("draggable-element")) {
      const elementType = e.target.innerText;
      e.dataTransfer.setData("text/plain", elementType);

      const preview = createDragPreview(elementType);
      e.dataTransfer.setDragImage(preview, 0, 0);

      setTimeout(() => {
        preview.style.display = "none";
      }, 0);

      e.target.addEventListener("dragend", () => removeDragPreview(preview), {
        once: true,
      });
    }
  }

  /**
   * Marks the current state of the application as having unsaved changes.
   */
  function markUnsavedChanges() {
    hasUnsavedChanges = true;
  }

  /**
   * Event listener for beforeunload to prompt user about unsaved changes
   */
  window.addEventListener("beforeunload", function (e) {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = "";
    }
  });

  /**
   * Dispatches a custom event when an element is added to the drop zone.
   * @param {string} elementId - The ID of the added element.
   */
  function dispatchElementAddedEvent(elementId) {
    const event = new CustomEvent("elementadded", {
      detail: { elementId: elementId },
    });
    dropZone.dispatchEvent(event);
  }

  /**
   * Dispatches a custom event when an element is removed from the drop zone.
   * @param {string} elementId - The ID of the removed element.
   */
  function dispatchElementRemovedEvent(elementId) {
    const event = new CustomEvent("elementremoved", {
      detail: { elementId: elementId },
    });
    dropZone.dispatchEvent(event);
  }
  /**
   * Saves the current application state to a file.
   * This function collects all the necessary data about the current application,
   * including the version, title, grid size, font, text color, drop zone dimensions,
   * background, and all the elements present in the drop zone. It then creates a
   * JSON file with this data and triggers a download.
   */
  function saveCurrentApp() {
    const appData = {
      version: version,
      title: webTitle.textContent,
      gridSize: GRID_SIZE,
      font: document.getElementById("fontSelect").value,
      textColor: document.getElementById("textColorInput").value,
      dropZoneWidth: dropZone.offsetWidth,
      dropZoneHeight: dropZone.offsetHeight,
      background: dropZone.style.backgroundImage,
      elements: [],
    };

    const elements = Array.from(
      dropZone.querySelectorAll(".draggable-element")
    );
    elements.sort(
      (a, b) =>
        (parseInt(a.style.zIndex) || 0) - (parseInt(b.style.zIndex) || 0)
    );

    elements.forEach((element, index) => {
      const elementType = element.getAttribute("data-element-type");
      const config = elementConfigs[elementType];

      appData.elements.push({
        id: element.id,
        type: elementType,
        left: parseFloat(element.style.left),
        top: parseFloat(element.style.top),
        width: parseFloat(element.style.width),
        height: parseFloat(element.style.height),
        layerOrder: index,
        zIndex: element.style.zIndex,
        properties: config.getProperties(element),
      });
    });

    const blob = new Blob([JSON.stringify(appData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "web.glitchGen";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    hasUnsavedChanges = false;
  }

  /**
   * Handles the file selection event when loading a saved application.
   * @param {Event} event - The file selection event.
   */
  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
      loadWebFromFile(file);
    }
  }

  /**
   * Creates a drag preview element for the given element type.
   * @param {Event} e - The drag event.
   * @param {string} elementType - The type of element being dragged.
   * @returns {HTMLElement} The created drag preview element.
   */
  function createDragPreview(e, elementType) {
    const config = elementConfigs[elementType];
    if (!config) return;

    const preview = document.createElement("div");
    preview.className =
      "drag-preview fixed pointer-events-none z-[100000] opacity-70 draggable-element p-2 bg-white shadow rounded overflow-hidden";
    preview.style.width = config.width || config.minWidth;
    preview.style.height = config.height || config.minHeight;
    preview.style.left = "-9999px";
    preview.style.top = "-9999px";

    const innerElement = document.createElement("div");
    innerElement.className = "element-holder";
    innerElement.innerHTML = config.innerHTML;
    preview.appendChild(innerElement);

    if (config.style) {
      Object.assign(preview.style, config.style);
    }

    document.body.appendChild(preview);
    return preview;
  }

  /**
   * Updates the position of the drag preview element.
   * @param {HTMLElement} preview - The drag preview element.
   * @param {number} x - The x-coordinate to move the preview to.
   * @param {number} y - The y-coordinate to move the preview to.
   */
  function updateDragPreview(preview, x, y) {
    if (preview) {
      const rect = preview.getBoundingClientRect();
      preview.style.left = `${x}px`;
      preview.style.top = `${y}px`;
    }
  }

  /**
   * Removes the drag preview element from the DOM.
   * @param {HTMLElement} preview - The drag preview element to remove.
   */
  function removeDragPreview(preview) {
    if (preview && preview.parentNode) {
      preview.parentNode.removeChild(preview);
    }
  }

  /**
   * Compresses an image file to the specified dimensions and quality.
   * @param {File} file - The image file to compress.
   * @param {number} maxWidth - The maximum width of the compressed image.
   * @param {number} maxHeight - The maximum height of the compressed image.
   * @param {number} quality - The quality of the compressed image (0 to 1).
   * @returns {Promise<Blob>} A promise that resolves with the compressed image blob.
   */
  function compressImage(file, maxWidth, maxHeight, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function () {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            "image/jpeg",
            quality
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  }

  /**
   * Opens the configuration modal for a given element.
   * @param {HTMLElement} element - The element to configure.
   */
  function openElementConfig(element) {
    // Set the current element being configured
    currentConfigElement = element.id;
    const elementType = element.getAttribute("data-element-type");
    const config = elementConfigs[elementType];
    const configOptions = document.getElementById("configOptions");
    configOptions.innerHTML = "";

    // Display the element's ID in the modal
    document.querySelector("#elementConfigModal .elementidname").textContent =
      `ID: ${element.id}`;

    // Iterate through configuration options and create UI elements
    config.configOptions.forEach((option) => {
      const optionElement = document.createElement("div");
      if (option.label) {
        optionElement.innerHTML = `
        <label for="${option.name}" class="block text-sm font-medium text-gray-700">${option.label}</label>
      `;
      }

      let input;
      // Create different types of input elements based on the option type
      if (option.type === "custom") {
        if (typeof option.render === "function") {
          input = option.render(element);
        } else {
          input = document.createElement("div");
          input.id = option.name;
          input.className = "grid grid-cols-3 gap-2 mt-2";
        }
      } else if (option.type === "file") {
        // Create file input for image upload
        input = document.createElement("input");
        input.type = "file";
        input.id = option.name;
        input.name = option.name;
        input.accept = "image/*";
        input.className =
          "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
        // Add event listener for image compression and preview
        input.addEventListener("change", async (event) => {
          const file = event.target.files[0];
          if (file) {
            try {
              const compressedBlob = await compressImage(
                file,
                2048,
                2048,
                0.85
              );
              const reader = new FileReader();
              reader.readAsDataURL(compressedBlob);
              reader.onload = (e) => {
                const imageData = e.target.result;
                element.querySelector("img").src = imageData;
                element.querySelector(".no-image-text").style.display = "none";
                element.setAttribute("data-image-data", imageData);
              };
            } catch (error) {
              console.error("Error compressing image:", error);
            }
          }
        });
      } else if (option.type === "select") {
        // Create select input
        input = document.createElement("select");
        input.id = option.name;
        input.name = option.name;
        input.className =
          "mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md";
        option.options.forEach((optionValue) => {
          const optElement = document.createElement("option");
          optElement.value = optionValue.value || optionValue;
          optElement.textContent = optionValue.label || optionValue;
          input.appendChild(optElement);
        });
      } else if (option.type === "button") {
        // Create button input
        input = document.createElement("button");
        input.textContent = option.label;
        input.className =
          "mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
      } else if (option.type === "textarea") {
        // Create textarea input
        input = document.createElement("textarea");
        input.id = option.name;
        input.name = option.name;
        input.className =
          "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
        input.rows = 5;
      } else {
        // Create default input element
        input = document.createElement("input");
        input.type = option.type;
        input.id = option.name;
        input.name = option.name;
        input.className =
          "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
      }

      // Handle API key storage and display
      const apiKeyName = option.name.endsWith("ApiKey") ? option.name : null;
      const storedApiKey = apiKeyName ? localStorage.getItem(apiKeyName) : null;

      if (apiKeyName) {
        if (storedApiKey) {
          // Display success message for stored API key
          const successMessage = document.createElement("input");
          successMessage.value = "API Key successfully stored. ";
          successMessage.className =
            "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-green-600";
          successMessage.disabled = true;
          optionElement.appendChild(successMessage);

          // Add "Remove API Key" button
          const removeButton = document.createElement("span");
          removeButton.textContent = `Remove key`;
          removeButton.className =
            "text-red-600 hover:text-red-700 hover:underline text-sm cursor-pointer";
          removeButton.addEventListener("click", () =>
            removeApiKey(apiKeyName, configOptions)
          );
          optionElement.appendChild(removeButton);

          configOptions.appendChild(optionElement);
          return;
        }
      }

      // Handle option dependencies
      if (option.dependsOn) {
        const dependencyMet = localStorage.getItem(option.dependsOn);
        input.disabled = !dependencyMet;
      }

      // Add help text and link if provided
      if (option.helpText && option.helpLink) {
        const helpLink = document.createElement("a");
        helpLink.href = option.helpLink;
        helpLink.target = "_blank";
        helpLink.textContent = option.helpText;
        helpLink.className = "text-sm text-blue-500 hover:text-blue-700";
        optionElement.appendChild(helpLink);
      }

      optionElement.appendChild(input);
      configOptions.appendChild(optionElement);

      // Add event listeners for specific input types
      if (apiKeyName) {
        // Store API key on input
        input.addEventListener(
          "input",
          debounce((e) => {
            const apiKey = e.target.value.trim();
            if (apiKey) {
              localStorage.setItem(apiKeyName, apiKey);
              updateApiKeyRelatedFields(apiKeyName, configOptions);
            }
          }, 300)
        );
      } else if (config.doesApiCall && option.name === "giphySearch") {
        // Handle Giphy search
        input.addEventListener(
          "input",
          debounce(async (e) => {
            const apiKey = localStorage.getItem("giphyApiKey");
            if (config.onSearch && apiKey) {
              await config.onSearch(e.target.value, apiKey, updateGifGrid);
            }
          }, 300)
        );
      } else if (config.doesApiCall && option.name === "imageSearch") {
        // Handle image search
        input.addEventListener(
          "input",
          debounce(async (e) => {
            const apiKey = localStorage.getItem("unsplashApiKey");
            if (config.onSearch && apiKey) {
              await config.onSearch(e.target.value, apiKey, updateImage);
            }
          }, 300)
        );
      } else if (config.doesApiCall && option.name === "generateButton") {
        // Handle AI image generation
        input.addEventListener("click", async () => {
          const apiKey = localStorage.getItem("openaiApiKey");
          const promptInput = document.getElementById("imagePrompt");
          if (config.onGenerate && apiKey && promptInput && promptInput.value) {
            input.disabled = true;
            input.textContent = "Generating...";
            try {
              await config.onGenerate(promptInput.value, apiKey, updateAiImage);
            } finally {
              input.disabled = false;
              input.textContent = "Generate Image";
            }
          }
        });
      }
    });

    // Set initial values for the configuration options
    const properties = config.getProperties(element);
    Object.keys(properties).forEach((key) => {
      const input = document.getElementById(key);
      if (input && input.type !== "file") {
        input.value = properties[key];
      }
    });

    // Open the modal and add keydown event listener
    modalSystem.openModal("elementConfigModal");
    elementConfigModal.addEventListener("keydown", handleConfigModalKeydown);
  }

  /**
   * Handles keydown events in the element configuration modal.
   * @param {KeyboardEvent} event - The keydown event.
   */
  function handleConfigModalKeydown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      const activeElement = document.activeElement;
      const isTextarea = activeElement.tagName.toLowerCase() === "textarea";

      // If it's a textarea and Enter is pressed without Shift, let it add a new line
      if (isTextarea) {
        return;
      }

      // For other inputs, prevent the default action and save the configuration
      event.preventDefault();
      saveElementConfig(event);
    }
  }

  /**
   * Handles the click event for removing an element.
   * Opens a confirmation modal when an element is selected for removal.
   */
  removeElementButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentConfigElement) {
      modalSystem.openModal("confirmModal");
    }
  });

  /**
   * Handles the click event for canceling element removal.
   * Closes the modal without removing the element.
   */
  cancelRemoveButton.addEventListener("click", () => {
    modalSystem.closeModal();
  });

  /**
   * Handles the click event for confirming element removal.
   * Removes the selected element, updates the UI, and closes the modals.
   */
  confirmRemoveButton.addEventListener("click", () => {
    if (currentConfigElement) {
      const elementToRemove = document.getElementById(currentConfigElement);
      if (elementToRemove) {
        elementToRemove.remove();
        dispatchElementRemovedEvent(currentConfigElement);
        togglePlaceholder();
        modalSystem.closeModal(); // Close the confirm modal
        modalSystem.closeModal(); // Close the element config modal
        currentConfigElement = null;
      }
    }
  });

  /**
   * Updates API key related fields in the configuration options.
   * Removes the API key input, adds a success message, and enables dependent inputs.
   * @param {string} apiKeyName - The name of the API key.
   * @param {HTMLElement} configOptions - The configuration options container.
   */
  function updateApiKeyRelatedFields(apiKeyName, configOptions) {
    // Remove the API key input field
    const apiKeyInput = configOptions.querySelector(`[name="${apiKeyName}"]`);
    if (apiKeyInput) {
      apiKeyInput.parentElement.remove();
    }

    // Add success message and remove button
    const successElement = document.createElement("div");
    successElement.innerHTML = `
      <p class="text-sm text-green-600 mt-1">API Key successfully stored.</p>
      <button class="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
        Remove ${apiKeyName.replace("ApiKey", " API Key")}
      </button>
    `;
    successElement
      .querySelector("button")
      .addEventListener("click", () => removeApiKey(apiKeyName, configOptions));
    configOptions.insertBefore(successElement, configOptions.firstChild);

    // Enable dependent inputs
    const apiKeyBaseName = apiKeyName.replace("ApiKey", "");
    // Iterate through all inputs in configOptions
    configOptions
      .querySelectorAll("input, select, textarea")
      .forEach((input) => {
        const inputName = input.getAttribute("name");
        if (inputName) {
          // Check all element configs for a matching dependsOn
          Object.values(elementConfigs).some((config) => {
            return config.configOptions.some((option) => {
              if (
                option.name === inputName &&
                option.dependsOn === apiKeyName
              ) {
                input.disabled = false;
                return true; // Exit the loop early
              }
            });
          });
        }
      });
  }

  /**
   * Removes the API key and resets related fields in the configuration options.
   * @param {string} apiKeyName - The name of the API key to remove.
   * @param {HTMLElement} configOptions - The configuration options container.
   */
  function removeApiKey(apiKeyName, configOptions) {
    localStorage.removeItem(apiKeyName);

    // Remove success message and remove button
    const successElement = configOptions.querySelector("div");
    if (successElement) {
      successElement.remove();
    }

    // Re-add the API key input field
    const apiKeyElement = document.createElement("div");
    apiKeyElement.innerHTML = `
      <label for="${apiKeyName}" class="block text-sm font-medium text-gray-700">${apiKeyName.replace("ApiKey", " API Key")}</label>
      <input type="text" id="${apiKeyName}" name="${apiKeyName}" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
    `;
    apiKeyElement.querySelector("input").addEventListener(
      "input",
      debounce((e) => {
        const apiKey = e.target.value.trim();
        if (apiKey) {
          localStorage.setItem(apiKeyName, apiKey);
          updateApiKeyRelatedFields(apiKeyName, configOptions);
        }
      }, 300)
    );
    configOptions.insertBefore(apiKeyElement, configOptions.firstChild);

    // Disable dependent inputs
    configOptions
      .querySelectorAll("input, select, textarea")
      .forEach((input) => {
        const inputName = input.getAttribute("name");
        if (inputName) {
          // Check all element configs for a matching dependsOn
          Object.values(elementConfigs).some((config) => {
            return config.configOptions.some((option) => {
              if (
                option.name === inputName &&
                option.dependsOn === apiKeyName
              ) {
                input.disabled = true;
                return true; // Exit the loop early
              }
            });
          });
        }
      });
  }

  /**
   * Updates the image of an element with the provided image URL.
   * @param {string} imageUrl - The URL of the new image.
   */
  function updateImage(imageUrl) {
    const element = document.getElementById(currentConfigElement);
    const container = element.querySelector("div") || element;

    // Create or update the img element
    let img = container.querySelector("img");
    if (!img) {
      img = document.createElement("img");
      img.className = "w-full h-full object-cover pointer-events-none";
    }
    img.src = imageUrl;
    img.alt = "Updated Image";

    // Clear the container and add the image
    container.innerHTML = "";
    container.appendChild(img);

    // Ensure the resizer is still present
    let resizer = element.querySelector(".resizer");
    if (!resizer) {
      resizer = document.createElement("div");
      resizer.className = "resizer";
      element.appendChild(resizer);
    }

    // Update the preview in the config modal
    const previewContainer = document.querySelector(
      "#configOptions .imagePreview"
    );
    if (previewContainer) {
      previewContainer.style.display = "flex";
      const previewImg = previewContainer.querySelector("img");
      if (previewImg) {
        previewImg.src = imageUrl;
      }
    }
  }

  /**
   * Updates the AI-generated image of an element and closes the modal.
   * @param {string} imageUrl - The URL of the AI-generated image.
   */
  function updateAiImage(imageUrl) {
    const element = document.getElementById(currentConfigElement);
    const container = element.querySelector("div") || element;

    // Create or update the img element
    let img = container.querySelector("img");
    if (!img) {
      img = document.createElement("img");
      img.className = "w-full h-full object-cover pointer-events-none";
    }
    img.src = imageUrl;
    img.alt = "AI Generated Image";

    // Clear the container and add the image
    container.innerHTML = "";
    container.appendChild(img);

    // Ensure the resizer is still present
    let resizer = element.querySelector(".resizer");
    if (!resizer) {
      resizer = document.createElement("div");
      resizer.className = "resizer";
      element.appendChild(resizer);
    }

    modalSystem.closeModal();
  }

  /**
   * Updates the GIF grid with the provided GIFs.
   * @param {Array} gifs - An array of GIF objects to display in the grid.
   */
  function updateGifGrid(gifs) {
    const gifGrid = document.getElementById("gifGrid");
    gifGrid.innerHTML = "";
    gifs.forEach((gif) => {
      const gifElement = document.createElement("div");
      gifElement.className =
        "cursor-pointer hover:opacity-75 transition-opacity";
      gifElement.innerHTML = `<img src="${gif.url}" alt="${gif.title}" class="w-full h-auto">`;
      gifElement.addEventListener("click", () => {
        const element = document.getElementById(currentConfigElement);
        element.querySelector("img").src = gif.fullSizeUrl;
        modalSystem.closeModal();
      });
      gifGrid.appendChild(gifElement);
    });
  }

  /**
   * Creates a debounced function that delays invoking the provided function.
   * @param {Function} func - The function to debounce.
   * @param {number} wait - The number of milliseconds to delay.
   * @returns {Function} The debounced function.
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Saves the configuration of the current element.
   * @param {Event} e - The event object.
   */
  function saveElementConfig(e) {
    e.preventDefault(); // Prevent form submission
    const element = document.getElementById(currentConfigElement);
    if (!element) {
      console.error("Element not found:", currentConfigElement);
      modalSystem.closeModal();
      return;
    }
    const elementType = element.getAttribute("data-element-type");
    const config = elementConfigs[elementType];
    const form = document.getElementById("elementConfigForm");
    const formData = new FormData(form);
    const properties = {};

    config.configOptions.forEach((option) => {
      properties[option.name] = formData.get(option.name);
    });

    config.setProperties(element, properties);
    modalSystem.closeModal();
    markUnsavedChanges();
    dispatchElementAddedEvent(element.id);

    // Remove the key listener when closing the modal
    elementConfigModal.removeEventListener("keydown", handleConfigModalKeydown);
  }

  /**
   * Handles the dragover event for file dropping.
   * @param {DragEvent} event - The dragover event.
   */
  function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Handles the file drop event for loading a web file.
   * @param {DragEvent} event - The drop event.
   */
  function handleFileDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    if (file && file.name.endsWith(".glitchGen")) {
      loadWebFromFile(file);
    } else {
      alert("Please drop a valid .glitchGen file.");
    }
  }

  /**
   * Loads web data from a file.
   * @param {File} file - The file containing web data.
   */
  function loadWebFromFile(file) {
    const reader = new FileReader();
    reader.onload = async function (event) {
      try {
        const appData = JSON.parse(event.target.result);
        modalSystem.closeModal("loadModal");
        await showLoadingAnimation();
        loadWebData(appData);

        // Add fade-in animation for the web elements
        gsap.from(".draggable-element", {
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        });
      } catch (error) {
        console.error("Error loading file:", error);
      }
    };
    reader.readAsText(file);
  }

  /**
   * Exports the current web configuration as an HTML file.
   * This function generates an HTML file with the current web layout, styles, and content.
   */
  function exportWeb() {
    const webTitle = document.getElementById("webTitle").textContent;
    const font = document.getElementById("fontSelect").value;
    const textColor = document.getElementById("textColorInput").value;
    const elements = Array.from(
      dropZone.querySelectorAll(".draggable-element")
    );
    const background = dropZone.style.backgroundImage;

    let htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${webTitle}</title>
      <link rel="stylesheet" href="https://websites.glitchgen.ai/css/styles.css">
      <link rel="stylesheet" href="https://websites.glitchgen.ai/css/styles_websites.css">
      <link rel="stylesheet" href="https://websites.glitchgen.ai/css/animate.min.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
      <link href="https://fonts.googleapis.com/css2?family=Roboto&family=Open+Sans&family=Lato&family=Montserrat&family=Playfair+Display&family=Merriweather&family=Nunito&family=Raleway&family=Poppins&family=Ubuntu&display=swap" rel="stylesheet">
      <style>
          body {
              font-family: '${font}', sans-serif;
              color: ${textColor};
              margin: 0;
              padding: 0;
          }
          #app-container {
              background-image: ${background};
              background-size: auto;
              background-repeat: repeat;
              background-position: center;
              min-height: 100vh;
              position: relative;
              margin: 0 auto;
          }
          .exported-element {
              position: absolute;
              overflow: hidden;
          }
          .exported-element img {
              width: 100%;
              height: 100%;
              object-fit: cover;
          }
      </style>
  </head>
  <body>
      <div id="app-container">
  `;

    elements.forEach((element) => {
      const elementType = element.getAttribute("data-element-type");
      const config = elementConfigs[elementType];
      const properties = config.getProperties(element);

      let elementContent = element.innerHTML;

      // Special handling for Image, AI Image, and Upload Image elements
      if (
        elementType === "Image Web Search" ||
        elementType === "AI Image" ||
        elementType === "Upload Image"
      ) {
        const img = element.querySelector("img");
        if (img && img.src) {
          const fitStyle = img.style.objectFit || "cover";
          elementContent = `<img src="${img.src}" alt="${img.alt || ""}" style="width: 100%; height: 100%; object-fit: ${fitStyle};">`;
        }
      }

      htmlContent += `
          <div class="exported-element" style="left: ${element.style.left}; top: ${element.style.top}; width: ${element.style.width}; height: ${element.style.height}; min-width: ${element.style.minWidth}; min-height: ${element.style.minHeight}; z-index: ${element.style.zIndex};">
              ${elementContent}
          </div>
      `;
    });

    htmlContent += `
      </div>
      <footer class="fixed bottom-0 left-0 right-0 bg-gray-100 py-2 px-4 shadow-md glitchgen-footer">
        <div class="container mx-auto flex items-center justify-center text-sm">
          <span class="mr-2 text-blue-600">Created with ❤️ on</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-2" viewbox="0 0 24 24">
            <defs>
              <pattern id="pixelPattern" width="2" height="2" patternUnits="userSpaceOnUse">
                <rect width="1" height="1" fill="#000" fill-opacity="0.1"></rect>
                <rect width="1" height="1" x="1" y="1" fill="#000" fill-opacity="0.1"></rect>
              </pattern>
            </defs>
            <rect x="2" y="2" width="20" height="16" fill="#808080"></rect>
            <rect x="3" y="3" width="18" height="14" fill="#C0C0C0"></rect>
            <rect x="4" y="4" width="16" height="10" fill="#000080">
              <animate attributename="fill" values="#000080; #008000; #800080; #008080; #000080" dur="10s" repeatcount="indefinite"></animate>
            </rect>
            <rect x="5" y="5" width="14" height="8" fill="#00FF00">
              <animate attributename="fill" values="#00FF00; #FF00FF; #FFFF00; #00FFFF; #00FF00" dur="10s" repeatcount="indefinite"></animate>
            </rect>
            <rect x="5" y="5" width="14" height="8" fill="url(#pixelPattern)"></rect>
            <rect x="5" y="5" width="14" height="2" fill="#C0C0C0"></rect>
            <rect x="6" y="6" width="2" height="1" fill="#808080"></rect>
            <rect x="9" y="6" width="2" height="1" fill="#808080"></rect>
            <rect x="12" y="6" width="2" height="1" fill="#808080"></rect>
            <rect x="8" y="18" width="8" height="2" fill="#808080"></rect>
            <rect x="7" y="20" width="10" height="2" fill="#808080"></rect>
          </svg>
          <a href="https://glitchgen.ai" class="text-blue-600 hover:text-blue-800 transition-colors duration-200">GlitchGen</a>
        </div>
      </footer>
  </body>
  </html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "website.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Displays a loading animation overlay.
   * @returns {Promise} A promise that resolves when the animation is complete.
   */
  function showLoadingAnimation() {
    return new Promise((resolve) => {
      const overlay = document.getElementById("loadingOverlay");
      const progressBar = document.getElementById("loadingProgressBar");
      overlay.classList.remove("hidden");

      const duration = Math.random() * 1.3 + 0.2;
      let progress = 0;

      gsap.to(progressBar, {
        width: "100%",
        duration: duration,
        ease: "power1.inOut",
        onUpdate: () => {
          progress = gsap.getProperty(progressBar, "width", "%");
          progressBar.style.width = `${progress}%`;
        },
        onComplete: () => {
          gsap.to(overlay, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              overlay.classList.add("hidden");
              overlay.style.opacity = 1;
              progressBar.style.width = "0%";
              resolve();
            },
          });
        },
      });
    });
  }

  /**
   * Loads web data from the provided app data object.
   * @param {Object} appData - The app data object containing web configuration and elements.
   */
  function loadWebData(appData) {
    highestZIndex = 1000;
    // Clear current app
    while (dropZone.firstChild) {
      dropZone.removeChild(dropZone.firstChild);
    }

    // Set web configuration
    webTitle.textContent = appData.title;
    GRID_SIZE = appData.gridSize;
    document.getElementById("fontSelect").value = appData.font;
    document.getElementById("textColorInput").value = appData.textColor;

    // Set initial drop zone size
    dropZoneInitialWidth = appData.dropZoneWidth || dropZone.offsetWidth;
    dropZoneInitialHeight = appData.dropZoneHeight || dropZone.offsetHeight;

    // Calculate scale factors
    const widthRatio = dropZone.offsetWidth / dropZoneInitialWidth;
    const heightRatio = dropZone.offsetHeight / dropZoneInitialHeight;

    // Set background
    if (appData.background) {
      dropZone.style.backgroundImage = appData.background;
    }

    // Set text color
    updateTextColor(appData.textColor);

    // Update DragDropManager with new grid size
    dragDropManager.gridSize = GRID_SIZE;

    // Load elements
    appData.elements.sort((a, b) => a.layerOrder - b.layerOrder);
    appData.elements.forEach((elementData, index) => {
      try {
        const config = elementConfigs[elementData.type];
        if (!config) {
          console.log(
            `Element type "${elementData.type}" not found. Skipping element with ID: ${elementData.id}`
          );
          return;
        }

        // Create the element
        const newElement = createElementByType(elementData.type, {
          ...elementData.properties,
          id: elementData.id,
        });

        if (!newElement) {
          console.log(
            `Failed to create element of type: ${elementData.type}. Skipping element with ID: ${elementData.id}`
          );
          return;
        }

        // Set element style
        newElement.style.position = "absolute";
        newElement.style.left = `${elementData.left}%`;
        newElement.style.top = `${elementData.top}%`;
        newElement.style.width = `${elementData.width}%`;
        newElement.style.height = `${elementData.height}%`;
        newElement.style.zIndex = (elementData.layerOrder + 1000).toString();

        // Add element to drop zone
        dropZone.appendChild(newElement);

        // Add drag functionality
        addDragFunctionality(newElement);

        // Add resize functionality
        addResize(newElement);

        // Load Gif or Image if necessary
        if (elementData.type === "Gif" && !elementData.properties.gifUrl) {
          config.loadGif(newElement);
        } else if (
          elementData.type === "Image Web Search" &&
          !elementData.properties.src
        ) {
          config.loadImage(newElement);
        }

        if (elementData.zIndex) {
          newElement.style.zIndex = elementData.zIndex;
          highestZIndex = Math.max(highestZIndex, parseInt(elementData.zIndex));
        } else {
          assignHighestZIndex(newElement);
        }
        dispatchElementAddedEvent(newElement.id);
      } catch (error) {
        console.log(`Error loading element at index ${index}:`, error);
        console.log("Element data:", elementData);
      }
    });

    highestZIndex += 1;
    togglePlaceholder();
    hasUnsavedChanges = false;

    // Re-initialize drag functionality for all elements
    dragDropManager.initializeExistingElements();
  }

  /**
   * Creates a new element based on the specified type and properties.
   * @param {string} type - The type of element to create.
   * @param {Object} properties - The properties to set on the new element.
   * @returns {HTMLElement} The newly created element.
   */
  function createElementByType(type, properties = {}) {
    const wrapper = document.createElement("div");
    wrapper.style.fontFamily = document.getElementById("fontSelect").value;
    wrapper.classList.add(
      "bg-white",
      "p-2",
      "rounded",
      "shadow",
      "inline-block",
      "overflow-hidden",
      "draggable-element"
    );
    wrapper.setAttribute("data-element-type", type);
    wrapper.id = properties.id || generateUniqueId();

    const config = elementConfigs[type];
    if (config) {
      if (!config.width) {
        config.width = config.minWidth;
      }
      if (!config.height) {
        config.height = config.minHeight;
      }

      const innerElement = document.createElement("div");
      innerElement.innerHTML = config.innerHTML;
      innerElement.classList.add("element-holder");

      wrapper.appendChild(innerElement);

      // Set initial size as percentage of drop zone
      const dropZoneRect = dropZone.getBoundingClientRect();
      const initialWidthPercent =
        (parseFloat(config.width) / dropZoneRect.width) * 100;
      const initialHeightPercent =
        (parseFloat(config.height) / dropZoneRect.height) * 100;

      wrapper.style.width = `${initialWidthPercent}%`;
      wrapper.style.height = `${initialHeightPercent}%`;
      if (config.minHeight) {
        wrapper.style.minHeight = config.minHeight;
      }
      if (config.minWidth) {
        wrapper.style.minWidth = config.minWidth;
      }
      wrapper.style.position = "absolute";
      wrapper.setAttribute("data-resize", config.resize);

      if (properties) {
        config.setProperties(wrapper, properties);
      }
    } else {
      wrapper.textContent = type;
    }

    return wrapper;
  }

  /**
   * Handles the dragover event for the drop zone.
   * @param {DragEvent} e - The dragover event.
   */
  function dragOver(e) {
    e.preventDefault();
  }

  /**
   * Handles the drop event for the drop zone.
   * @param {DragEvent} e - The drop event.
   */
  function drop(e) {
    e.preventDefault();
    if (dragDropManager.isDragging) return;

    const elementType = e.dataTransfer.getData("text");
    if (elementType) {
      const newElement = createElementByType(elementType);
      addDragFunctionality(newElement);
      const dropZoneRect = dropZone.getBoundingClientRect();

      // Calculate position as percentage
      const leftPercent =
        ((e.clientX - dropZoneRect.left) / dropZoneRect.width) * 100;
      const topPercent =
        ((e.clientY - dropZoneRect.top) / dropZoneRect.height) * 100;

      // Snap to grid (you may want to adjust this for percentage-based positioning)
      const snappedLeftPercent =
        Math.round(leftPercent / ((GRID_SIZE / dropZoneRect.width) * 100)) *
        ((GRID_SIZE / dropZoneRect.width) * 100);
      const snappedTopPercent =
        Math.round(topPercent / ((GRID_SIZE / dropZoneRect.height) * 100)) *
        ((GRID_SIZE / dropZoneRect.height) * 100);

      newElement.style.left = `${snappedLeftPercent}%`;
      newElement.style.top = `${snappedTopPercent}%`;

      assignHighestZIndex(newElement);

      dropZone.appendChild(newElement);
      addResize(newElement);
      togglePlaceholder();

      dispatchElementAddedEvent(newElement.id);
    }
  }

  function assignHighestZIndex(element) {
    highestZIndex += 1;
    element.style.zIndex = highestZIndex.toString();
  }

  /**
   * Toggles the visibility of the placeholder element based on the content of the drop zone.
   * Hides the placeholder if there are elements in the drop zone or if it has a background image.
   * Shows the placeholder if the drop zone is empty and has no background.
   */
  function togglePlaceholder() {
    const placeholder = document.getElementById("placeholder");
    const dropZone = document.getElementById("drop-zone");

    if (!placeholder) {
      return; // Exit the function if placeholder is not found
    }

    if (!dropZone) {
      return; // Exit the function if drop zone is not found
    }

    if (dropZone.children.length > 1 || dropZone.style.backgroundImage) {
      placeholder.style.display = "none";
    } else {
      placeholder.style.display = "flex";
    }
  }

  /**
   * Updates the text color of the body and all draggable elements.
   * @param {string} color - The color to set for the text.
   */
  function updateTextColor(color) {
    document.body.style.color = color;
    const elements = document.querySelectorAll(".draggable-element");
    elements.forEach((elem) => {
      elem.style.color = color;
    });
  }

  /**
   * Adds drag functionality to an element and sets up a click event listener.
   * @param {HTMLElement} element - The element to make draggable.
   */
  function addDragFunctionality(element) {
    dragDropManager.makeDraggable(element);
    element.addEventListener("click", handleElementClick);
  }

  /**
   * Handles click events on draggable elements.
   * Prevents opening the configuration if the element was just dragged or resized.
   * @param {Event} e - The click event.
   */
  function handleElementClick(e) {
    if (dragDropManager.hasDragged) {
      dragDropManager.hasDragged = false;
      return;
    }

    const now = Date.now();
    if (
      justDropped ||
      justResized ||
      (now - lastInteractionTime < INTERACTION_DELAY &&
        dragDropManager.isDragging)
    ) {
      return;
    }

    e.stopPropagation();
    openElementConfig(this);
  }

  /**
   * Adds resize functionality to an element based on its resize type attribute.
   * Creates a resizer element, sets up event listeners for showing/hiding the resizer,
   * and initializes the resize functionality.
   * @param {HTMLElement} element - The element to make resizable.
   */
  function addResize(element) {
    const resizeType = element.getAttribute("data-resize");
    if (!resizeType) return;

    const resizer = document.createElement("div");
    resizer.className = "resizer";
    resizer.style.width = "20px";
    resizer.style.height = "20px";

    element.appendChild(resizer);

    /**
     * Shows the resizer element when the mouse is over the parent element.
     */
    element.addEventListener(
      "mouseover",
      () => (resizer.style.display = "block")
    );

    /**
     * Hides the resizer element when the mouse leaves the parent element.
     */
    element.addEventListener(
      "mouseout",
      () => (resizer.style.display = "none")
    );

    let startWidth, startHeight, startX, startY, startLeft, startTop;

    /**
     * Initiates the resize operation when the resizer is clicked.
     */
    resizer.addEventListener("mousedown", startResize);

    /**
     * Starts the resize operation, setting initial dimensions and positions.
     * Adds event listeners for resize and stopResize.
     * @param {MouseEvent} e - The mousedown event object.
     */
    function startResize(e) {
      e.preventDefault();
      e.stopPropagation();

      // Set the resizing flag to true
      isResizing = true;

      // Get the initial width and height of the element
      startWidth = element.getBoundingClientRect().width;
      startHeight = element.getBoundingClientRect().height;

      // Calculate the initial left and top positions relative to the drop zone
      startLeft =
        element.getBoundingClientRect().left -
        dropZone.getBoundingClientRect().left;
      startTop =
        element.getBoundingClientRect().top -
        dropZone.getBoundingClientRect().top;

      // Store the initial mouse position
      startX = e.clientX;
      startY = e.clientY;

      // Add event listeners for resizing and stopping the resize
      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stopResize);
    }
    /**
     * Handles the resizing of an element during a mouse move event.
     * Adjusts the width and height of the element based on the mouse movement and resize type.
     * Also maintains the element's position relative to its top-left corner.
     * @param {MouseEvent} e - The mouse move event object.
     */
    function resize(e) {
      // If not currently resizing, exit the function
      if (!isResizing) return;

      // Calculate the change in mouse position
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // Get the current dimensions of the drop zone
      const dropZoneRect = dropZone.getBoundingClientRect();

      // Handle horizontal or both-direction resizing
      if (resizeType === "horizontal" || resizeType === "both") {
        // Calculate new width as a percentage of the drop zone width
        const newWidth = ((startWidth + dx) / dropZoneRect.width) * 100;
        // Apply the new width to the element
        element.style.width = `${newWidth}%`;
      }

      // Handle both-direction resizing (includes vertical)
      if (resizeType === "both") {
        // Calculate new height as a percentage of the drop zone height
        const newHeight = ((startHeight + dy) / dropZoneRect.height) * 100;
        // Apply the new height to the element
        element.style.height = `${newHeight}%`;
      }

      // Adjust position to keep the top-left corner in place
      const newLeft = (startLeft / dropZoneRect.width) * 100;
      const newTop = (startTop / dropZoneRect.height) * 100;
      // Apply the new positions to the element
      element.style.left = `${newLeft}%`;
      element.style.top = `${newTop}%`;

      // Set fixed dimensions for the resizer handle
      resizer.style.width = "20px";
      resizer.style.height = "20px";
    }

    /**
     * Handles the end of a resize operation.
     * Resets resize-related flags, removes event listeners, marks unsaved changes,
     * and calls the element's onResize method if it exists.
     */
    function stopResize() {
      if (isResizing) {
        isResizing = false;
        lastInteractionTime = Date.now();
        justResized = true;
        setTimeout(() => {
          justResized = false;
        }, INTERACTION_DELAY);
        document.removeEventListener("mousemove", resize);
        document.removeEventListener("mouseup", stopResize);
        markUnsavedChanges();

        // Call onResize method if it exists for the element
        const elementType = element.getAttribute("data-element-type");
        const config = elementConfigs[elementType];
        if (config && typeof config.onResize === "function") {
          config.onResize(element);
        }
      }
    }
  }

  /**
   * Updates the font family for all draggable elements.
   * @param {string} fontFamily - The font family to apply.
   */
  function updateFont(fontFamily) {
    const elements = document.querySelectorAll(".draggable-element");
    elements.forEach((elem) => {
      elem.style.fontFamily = fontFamily;
    });
  }

  /**
   * Event listener for element updates.
   * Calls the onResize method for the updated element if it exists.
   */
  document.addEventListener("elementUpdated", (event) => {
    const element = event.detail.element;
    const elementType = element.getAttribute("data-element-type");
    const config = elementConfigs[elementType];
    if (config && typeof config.onResize === "function") {
      config.onResize(element);
    }
  });

  /**
   * Event listener for clicks on the confirm modal.
   * Closes the modal if the click is outside the modal content.
   */
  confirmModal.addEventListener("click", (e) => {
    if (e.target === confirmModal) {
      elementToRemove = null;
      confirmModal.classList.add("hidden");
    }
  });

  /**
   * Event listener for opening the app configuration modal.
   */
  const openAppConfig = document.getElementById("openAppConfig");
  openAppConfig.addEventListener("click", () =>
    modalSystem.openModal("configModal")
  );

  populateElementsList();
  populateBgOptions();

  /**
   * Event listener for submitting the element configuration form.
   */
  document
    .getElementById("elementConfigForm")
    .addEventListener("submit", saveElementConfig);

  /**
   * Event listener for canceling the element configuration.
   */
  document
    .getElementById("cancelElementConfig")
    .addEventListener("click", () => modalSystem.closeModal());
});
