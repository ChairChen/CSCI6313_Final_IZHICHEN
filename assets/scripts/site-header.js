// define style sheet
const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
  /* ========== default styles ========== */
  :host {
    /* size & layout */
    --header-max-width: 1200px;
    --header-padding-block: 12px;
    --header-padding-inline: 16px;
    --header-gap: 12px;

    /* color & font */
    --header-bg: oklch(0.98 0.01 270);
    --header-fg: oklch(0.22 0 0);
    --link-fg: var(--header-fg);
    --link-hover-fg: oklch(0.32 0.03 260);
    --current-fg: oklch(0.26 0.04 250);


    /* appearance */
    --header-radius: 12px;
    --header-shadow: 0 6px 18px rgba(0,0,0,.06);
    --current-underline: 2px solid currentColor;

    display: block;
    color: var(--header-fg);
    background: transparent;
  }

  /* variant example: <site-header variant="dark"> switch theme */
  :host([variant="dark"]) {
    --header-bg: oklch(0.28 0.03 260);
    --header-fg: oklch(0.97 0.02 250);
    --link-fg: var(--header-fg);
    --link-hover-fg: oklch(0.9 0.03 250);
    --current-fg: oklch(0.95 0.02 260);
    --header-shadow: 0 8px 22px rgba(0,0,0,.25);
  }

  /* :host dedicated size/can be overwrite by external container layer */
  :host {
    margin: 0; /* for external uses: site-header { margin-block: 16px } control layout */
  }

  /* ========== internal default ========== */
  header {
    part: container;
    background: var(--header-bg);
    color: var(--header-fg);
    box-shadow: var(--header-shadow);
    border-radius: var(--header-radius);
    padding-block: var(--header-padding-block);
    padding-inline: var(--header-padding-inline);
  }

  /* layout side by side */
  .row {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--header-gap);
    max-width: var(--header-max-width);
    margin-inline: auto;
  }

  h3 {
    part: title;
    margin: 0;
    font-size: 1rem;
    line-height: 1.2;
    font-weight: 600;
  }

  nav {
    part: nav;
    display: flex;
    align-items: center;
    gap: clamp(8px, 2vw, 18px);
    flex-wrap: wrap;
  }

  a {
    part: link;
    color: var(--link-fg);
    text-decoration: none;
    font-size: .95rem;
    line-height: 1.2;
    padding: 6px 8px;
    border-radius: 8px;
    outline: none;
    transition: color .15s ease, background .15s ease, outline-color .15s ease;
  }

  a:hover {
    color: var(--link-hover-fg);
    background: color-mix(in oklch, var(--header-bg) 85%, black 15%);
  }

  /* highlight current page */
  a[aria-current="page"] {
    part: current;
    color: var(--current-fg);
    text-decoration: none;
    position: relative;
  }
  a[aria-current="page"]::after {
    content: "";
    position: absolute;
    left: 8px; right: 8px; bottom: -4px;
    border-bottom: var(--current-underline);
  }

  /* accessibility focus visualization */
  a:focus-visible {
    outline: 2px solid color-mix(in oklch, var(--link-hover-fg) 65%, white 35%);
    outline-offset: 2px;
  }


  /* ========== responsive menu ========== */
  .menu-toggle {
    display: none;
    font-size: 1.5rem;
    cursor: pointer;
    user-select: none;
  }

  @media (max-width: 800px) {
    nav {
      display: none;
      flex-direction: column;
      align-items: flex-start;
      background: var(--header-bg);
      position: absolute;
      right: 0px;
      top: 56px;
      border-radius: var(--header-radius);
      box-shadow: var(--header-shadow);
      padding: 12px;
      animation: fadeIn .2s ease;
    }
    nav.open {
      display: flex;
    }
    .menu-toggle {
      display: inline-block;
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }

 /* theme toggle button */
 .theme {
    position: relative;
    display: inline-block;
    height: 25px;
    width: 60px;
    overflow: hidden;
    border: 1px solid var(--header-fg);
    border-radius: var(--header-radius);
    cursor: pointer;
    color: var(--header-fg);
    box-shadow: inset 0 0 2px 0px var(--header-fg);
 }

 input[id="theme"] {
    display: none;
    visibility: hidden;
 }

 .theme-button {
    position: absolute;
    bottom: 0px;
    right: 0px;
    left: 0px;
    top: 0px;
    display: flex;
    width: 100%;
    justify-content: space-around;
 }
 
 .theme-button::before{
    position: absolute;
    left: 0;
    top: 0;
    content: " ";
    height: 100%;
    width: 50%;
    border-radius: 50em;
    border: 0.5px none var(--header-fg);
    box-shadow: 0 0 35px 5px var(--header-fg);
    transition: 0.2s ease-in-out;
 }

 input[id="theme"]:checked + .theme-button::before{
    left: 48%;
 }

`);

// define custom component
class SiteHeader extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open'});

    const tpl = document.createElement('template');
    tpl.innerHTML = `
      <header part="container">
        <div class="row">
          <div>
            <h3 part="title"><slot name="title">My Awesome Site-Header</slot></h3>
          </div>

          <span class="menu-toggle" id="menuToggle">☰</span>


          <nav part="nav">
          
            <a part="link"
               data-route="/index.html"
               href="index.html">Home</a>

            <a part="link"
               data-route="/contact.html"
               href="contact.html">Contact</a>

            <a part="link"
               data-route="/map.html"
               href="map.html">Map</a>
               
            <a part="link"
               data-route="/docs.html"
               href="docs.html">Docs</a>

            <label class="theme">
              <input type="checkbox" id="theme" name="theme" />
              <span class="theme-button">
                <span>&#127774;</span>
                <span>&#127770;</span>
              </span>
            </label>
          </nav>

        </div>
      </header>
    `;
    root.adoptedStyleSheets = [stylesheet];
    root.appendChild(tpl.content.cloneNode(true));
  }

  connectedCallback() {
    // Highlight current page by URL or explicit attribute: <site-header current="/about.html">
    const currentAttr = this.getAttribute('current');
    const currentpath = currentAttr || window.location.pathname || '/';

    const links = this.shadowRoot.querySelectorAll('a[data-route]');
    links.forEach(a => {
      // Normalize trailing slashes for matching
      const want = (a.getAttribute('data-route') || '').replace(/\/+$/, '');
      const alternate = '/CSCI6313_Final_IZHICHEN' + (a.getAttribute('data-route') || '').replace(/\/+$/, '');
      const have = (currentpath || '').replace(/\/+$/, '');
      if (want === have || alternate === have) a.setAttribute('aria-current', 'page');
    });

    // let theme toggle button control parent DocumentFragment theme
    this.shadowRoot.getElementById("theme").addEventListener("click", ()=>{
      // Connect to parent DocumentFragment Body
      const body = document.body;
      if (body) {
        console.log('Element has been appended to the DocumentFragment');
        body.classList.toggle('dark');
      } else {
        console.log('Element has been removed from the DocumentFragment');
      }
    });

    
    // menu toggle for small screens
    const toggle = this.shadowRoot.getElementById("menuToggle");
    const nav = this.shadowRoot.querySelector("nav");
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }
}

customElements.define('site-header', SiteHeader);
