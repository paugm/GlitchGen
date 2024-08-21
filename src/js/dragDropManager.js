export class DragDropManager {
  constructor(dropZone, gridSize, assignHighestZIndex) {
    this.dropZone = dropZone;
    this.gridSize = gridSize;
    this.assignHighestZIndex = assignHighestZIndex;
    this.isDragging = false;
    this.currentElement = null;
    this.startX = 0;
    this.startY = 0;
    this.initialLeft = 0;
    this.initialTop = 0;
    this.hasDragged = false;
    this.startLeft = 0;
    this.startTop = 0;

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  /**
   * Makes an element draggable by adding a mousedown event listener.
   * @param {HTMLElement} element - The element to make draggable.
   */
  makeDraggable(element) {
    element.addEventListener("mousedown", (e) =>
      this.startDragging(e, element)
    );
  }

  /**
   * Initiates the dragging process for an element.
   * @param {MouseEvent} e - The mousedown event.
   * @param {HTMLElement} element - The element being dragged.
   */
  startDragging(e, element) {
    e.preventDefault();
    this.isDragging = true;
    this.currentElement = element;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.hasDragged = false;
    const rect = element.getBoundingClientRect();
    const dropZoneRect = this.dropZone.getBoundingClientRect();
    this.initialLeft =
      ((rect.left - dropZoneRect.left) / dropZoneRect.width) * 100;
    this.initialTop =
      ((rect.top - dropZoneRect.top) / dropZoneRect.height) * 100;

    // Store the starting position
    this.startLeft = parseFloat(element.style.left);
    this.startTop = parseFloat(element.style.top);

    /**
     * Adds mousemove event listener to handle element dragging.
     */
    document.addEventListener("mousemove", this.handleMouseMove);

    /**
     * Adds mouseup event listener to handle the end of dragging.
     */
    document.addEventListener("mouseup", this.handleMouseUp);

    // Bring the element to the top
    this.assignHighestZIndex(this.currentElement);
  }

  /**
   * Handles the mouse movement during dragging.
   * @param {MouseEvent} e - The mousemove event.
   */
  handleMouseMove(e) {
    if (this.isDragging && this.currentElement) {
      this.hasDragged = true;
      const dropZoneRect = this.dropZone.getBoundingClientRect();
      const dx = ((e.clientX - this.startX) / dropZoneRect.width) * 100;
      const dy = ((e.clientY - this.startY) / dropZoneRect.height) * 100;

      let newLeft = this.initialLeft + dx;
      let newTop = this.initialTop + dy;

      newLeft = Math.max(
        0,
        Math.min(newLeft, 100 - parseFloat(this.currentElement.style.width))
      );
      newTop = Math.max(
        0,
        Math.min(newTop, 100 - parseFloat(this.currentElement.style.height))
      );

      const gridSizePercentX = (this.gridSize / dropZoneRect.width) * 100;
      const gridSizePercentY = (this.gridSize / dropZoneRect.height) * 100;
      newLeft = Math.round(newLeft / gridSizePercentX) * gridSizePercentX;
      newTop = Math.round(newTop / gridSizePercentY) * gridSizePercentY;

      this.currentElement.style.left = `${newLeft}%`;
      this.currentElement.style.top = `${newTop}%`;
    }
  }

  /**
   * Handles the end of dragging when the mouse button is released.
   */
  handleMouseUp() {
    if (this.isDragging && this.currentElement) {
      const endLeft = parseFloat(this.currentElement.style.left);
      const endTop = parseFloat(this.currentElement.style.top);

      if (endLeft === this.startLeft && endTop === this.startTop) {
        // The element didn't move, treat it as a click
        this.openElementConfig(this.currentElement);
      }
    }

    this.isDragging = false;
    this.currentElement = null;
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
  }

  /**
   * Opens the configuration modal for the given element.
   * @param {HTMLElement} element - The element to configure.
   */
  openElementConfig(element) {
    // Dispatch a custom event to open the element config modal
    const event = new CustomEvent("openElementConfig", { detail: { element } });
    this.dropZone.dispatchEvent(event);
  }

  /**
   * Initializes dragging functionality for existing elements in the drop zone.
   */
  initializeExistingElements() {
    const elements = this.dropZone.querySelectorAll(".draggable-element");
    elements.forEach((element) => this.makeDraggable(element));
  }

  /**
   * Gets the highest z-index among all draggable elements.
   * @returns {number} The maximum z-index value.
   */
  getMaxZIndex() {
    const elements = this.dropZone.querySelectorAll(".draggable-element");
    let maxZIndex = 0;
    elements.forEach((element) => {
      const zIndex = parseInt(element.style.zIndex || 0);
      if (zIndex > maxZIndex) {
        maxZIndex = zIndex;
      }
    });
    return maxZIndex;
  }
}
