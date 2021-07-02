Use : 

```javascript
customElements.define('nav-accordion', Accordion);
```

```html
<nav-accordion>
    <nav-accordion-item
        id="chapitre1"
        label="Chapitre 1 - Titre"
        expanded="true"
    >
      <button>fff</button>
      <button>fff</button>
      <button>fff</button>
      <button>fff</button>
      <button>fff</button>
    </nav-accordion-item>
    <nav-accordion-item
        id="chapitre2"
        label="Chapitre 2 - Titre"
    >
      <button>fff</button>
      <button>fff</button>
      <button>fff</button>
      <button>fff</button>
      <button>fff</button>
    </nav-accordion-item>
    <nav-accordion-item
        id="chapitre3"
        label="Chapitre 3 - Titre"
    >
      <button>fff</button>
      <button>fff</button>
      <button>fff</button>
      <button>fff</button>
      <button>fff</button>
    </nav-accordion-item>
</nav-accordion>
```

nav-accordion can have two attributes : 

allow-toggle => Allow for each toggle to both open and close its section. Makes it possible for all sections to be closed. Assumes only one section may be open.
allow-multiple => Allow for multiple accordion sections to be expanded at the same time. Assumes data-allow-toggle otherwise the toggle on open sections would be disabled.