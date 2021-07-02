import AccordionItem from './AccordionItem';

/**
 * @see https://www.w3.org/TR/wai-aria-practices-1.1/examples/accordion/accordion.html
 */
export default class Accordion extends HTMLElement {
  constructor() {
    super();
    customElements.define('nav-accordion-item', AccordionItem);
    this._cacheDOM();
    this._checkDOMIsCorrect();
    if (!this.allowMultiple && this.activeItems.length > 1) {
      throw new Error('You cannot define more than one expanded accordion if your accordion does not have the "allow-multiple" attribute.');
    }
  }

  /**
   * Do the accordion allow to toggle items ? (Expand / collapse)
   *
   * @returns {boolean}
   */
  get allowToggle() {
    if (this.allowMultiple) {
      return true;
    } else {
      return this.hasAttribute('allow-toggle');
    }
  }

  /**
   * Do the accordion allow multiple items to be open at the same time ?
   *
   * Will automatically allow toggle (to expand or collapse items)
   *
   * @returns {boolean}
   */
  get allowMultiple() {
    return this.hasAttribute('allow-multiple');
  }

  /**
   * Return active accordion items.
   */
  get activeItems() {
    if (typeof this.$accordionItems === 'undefined') return [];
    return [...this.$accordionItems].filter($accordionItem => $accordionItem.expanded === true);
  }

  /**
   * Go to the first item.
   */
  goToFirstItem() {
    this.$accordionItems[0].focus();
  }

  /**
   * Go to the last item.
   */
  goToLastItem() {
    this.$accordionItems[this.$accordionItems.length - 1].focus();
  }

  /**
   * Go to the previous item.
   *
   * @param {AccordionItem} item
   */
  goToPreviousItem(item) {
    const itemIndex = [...this.$accordionItems].findIndex($accordionItem => $accordionItem === item);
    let goToIndex = itemIndex - 1;
    if (itemIndex === 0) {
      goToIndex = this.$accordionItems.length - 1;
    }

    this.$accordionItems[goToIndex].focus();
  }

  /**
   * Go to the next item.
   *
   * @param {AccordionItem} item
   */
  goToNextItem(item) {
    const itemIndex = [...this.$accordionItems].findIndex($accordionItem => $accordionItem === item);
    let goToIndex = itemIndex + 1;
    if (itemIndex === this.$accordionItems.length - 1) {
      goToIndex = 0;
    }

    this.$accordionItems[goToIndex].focus();
  }

  /**
   * Cache DOM elements.
   *
   * @private
   */
  _cacheDOM() {
    this.$accordionItems = this.children;
  }

  connectedCallback() {
    this._eventListeners();
  }

  /**
   * Ensure that DOM elements are ok. Otherwise throw exceptions.
   *
   * @private
   */
  _checkDOMIsCorrect() {
    [...this.$accordionItems].forEach(($accordionItem) => {
      if (!(
          $accordionItem instanceof AccordionItem
      )) {
        throw new Error(`Accordion should have AccordionItem as children. ${$accordionItem} is not an instance of AccordionItem.`);
      }
    });
  }

  /**
   * Handle event listeners.
   *
   * @private
   */
  _eventListeners = () => {
    // Focus in
    this.addEventListener(
        'focusin',
        () => (
            this.classList.add('focus')
        )
    );

    // Focus out
    this.addEventListener('focusout', () => {
      this.classList.remove('focus');
    });
  };
}
