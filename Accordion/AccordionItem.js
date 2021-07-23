import Accordion from './Accordion';

export default class AccordionItem extends HTMLElement {
  constructor() {
    super();
    if (!this.label) {
      throw new Error('Please specify a label for the accordion item.');
    }
    if (!this.id) {
      throw new Error('Please specify an ID for the accordion item.');
    }
  }

  /**
   * Get label for the accordion item.
   *
   * @returns {string}
   */
  get label() {
    return this.getAttribute('label');
  }

  /**
   * Is the accordion item expanded.
   *
   * @returns {boolean}
   */
  get expanded() {
    return this.getAttribute('expanded') === 'true';
  }

  /**
   * Set the expanded attribute.
   *
   * @param expanded
   */
  set expanded(expanded) {
    if (expanded) {
      if (!this.$accordion.allowToggle) {
        this.$button.ariaDisabled = true;
      }
      if (!this.$accordion.allowMultiple) {
        this.$accordion.activeItems.forEach(($activeItem) => ($activeItem.expanded = false));
      }
      this.setAttribute('expanded', 'true');
      this.$button.ariaExpanded = true;
      this.$section.ariaHidden = false;
      this.$section
        .querySelectorAll(this._getFocusableElements())
        .forEach(($focusableElement) => $focusableElement.setAttribute('tabindex', '0'));
    } else {
      if (!this.$accordion.allowToggle) {
        this.$button.removeAttribute('aria-disabled');
      }
      this.setAttribute('expanded', 'false');
      this.$button.ariaExpanded = false;
      this.$section.ariaHidden = true;
      this.$section
        .querySelectorAll(this._getFocusableElements())
        .forEach(($focusableElement) => $focusableElement.setAttribute('tabindex', '-1'));
    }
  }

  /**
   * Focus an accordion item.
   */
  focus() {
    this.$button.focus();
  }

  /**
   * Get an array of the focusable elements
   *
   * @private
   */
  _getFocusableElements() {
    return [
      'a',
      '[role="checkbox"]',
      '[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ];
  }

  /**
   * Cache DOM elements.
   *
   * @private
   */
  _cacheDOM() {
    /**
     * @type {Accordion}
     */
    this.$accordion = this.parentNode;
    this.$button = this.querySelector('[data-accordion-item-button]');
    this.$section = this.querySelector('[data-accordion-item-section]');
  }

  /**
   * Add accessible attributes for the trigger (button).
   *
   * @private
   */
  _accessibleTrigger() {
    this.$button.setAttribute('tabindex', '0');
    this.$button.id = this.labelId;
    this.expanded = this.getAttribute('expanded');
    this.$button.setAttribute('aria-controls', this.id);
  }

  connectedCallback() {
    this._checkIdIsCorrect();
    this._checkIdDoesnotExist();

    this.content = this.innerHTML;
    this.innerHTML = null;
    this.labelId = `label-${this.id}`;

    this._addSection();
    this._addButton();

    this._cacheDOM();
    this._checkDOMIsCorrect();

    this._accessibleTrigger();
    this._accessibleSection();
    this._eventListeners();
    if (!this.$accordion.allowUserEvents) {
      this.$button.ariaDisabled = true;
    }
  }

  /**
   * Handle event listeners.
   *
   * @private
   */
  _eventListeners = () => {
    this.$button.addEventListener('click', (e) => {
      e.preventDefault();
      return false;
    });
    if (this.$accordion.allowUserEvents) {
      // On click
      this.$button.addEventListener('click', (e) => {
        if (!this.$button.ariaDisabled) {
          if (!this.$accordion.allowToggle) {
            this.expanded = true;
          } else {
            this.expanded = !this.expanded;
          }
        }
      });
    }

    // On keydown :
    // Space
    // Enter
    // Up Arrow
    // Down Arrow
    // Home
    // End
    this.$button.addEventListener('keydown', (e) => {
      // Space / Enter => Open the accordion
      if (this.$accordion.allowUserEvents) {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          if (!this.$accordion.allowToggle) {
            this.expanded = true;
          } else {
            this.expanded = !this.expanded;
          }
          return false;
        }
      }

      // Up arrow => Go to the previous accordion
      if (e.code === 'ArrowUp') {
        e.preventDefault();
        this.$accordion.goToPreviousItem(this);
        return false;
      }

      // Down arrow => Go to the next accordion
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        this.$accordion.goToNextItem(this);
        return false;
      }

      // Home => Go to the first accordion
      if (e.code === 'Home') {
        e.preventDefault();
        this.$accordion.goToFirstItem();
        return false;
      }

      // End => Go to the last accordion
      if (e.code === 'End') {
        e.preventDefault();
        this.$accordion.goToLastItem();
        return false;
      }
    });
  };

  /**
   * Ensure that DOM elements are ok. Otherwise throw exceptions.
   *
   * @private
   */
  _checkDOMIsCorrect() {
    if (!(this.$accordion instanceof Accordion)) {
      throw new Error(`Accordion item should have an Accordion as parent. ${this.$accordion} is not an instance of Accordion.`);
    }
  }

  /**
   * Ensure that the ID is a slug.
   *
   * @private
   */
  _checkIdIsCorrect() {
    const regex = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;

    if (regex.exec(this.id) === null) {
      throw new Error(`The ID ${this.id} is not a correct ID. Please slugify it.`);
    }
  }

  /**
   * Ensure ID does not already exists
   *
   * @private
   */
  _checkIdDoesnotExist() {
    const $idElements = document.querySelectorAll(`#${this.id}`);
    [...$idElements].forEach(($idElement) => {
      if ($idElement && $idElement !== this) {
        throw new Error(`The ID ${this.id} already exists in the DOM. Please rename it.`);
      }
    });
  }

  /**
   * Add section
   *
   * @private
   */
  _addSection() {
    const $section = document.createElement('div');
    $section.dataset.accordionItemSection = '';
    $section.innerHTML = this.content;
    this.append($section);
  }

  /**
   * Add button.
   *
   * @private
   */
  _addButton() {
    const $button = document.createElement('button');
    $button.dataset.accordionItemButton = '';
    $button.innerHTML = this.label;
    this.prepend($button);
  }

  /**
   * Add the accessible content of the accordion item.
   *
   * @private
   */
  _accessibleSection() {
    this.$section.id = this.id;
    this.$section.setAttribute('role', 'region');
    this.$section.setAttribute('aria-labelledby', this.labelId);
    this.$section.setAttribute('aria-hidden', `${!this.expanded}`);
  }
}
