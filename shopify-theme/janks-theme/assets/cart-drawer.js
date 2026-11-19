/* JANKS cart drawer.
   A drop-in for Dawn's <cart-drawer>: product-form.js finds this element and calls getSectionsToRender() / renderContents(),
   so "Add to cart" keeps working. Line changes use the Cart AJAX API + Section Rendering API. */
class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this.mount = this.querySelector('[data-jt-cart-mount]');
    this.panel = this.querySelector('.jt-cdrawer__panel');
    this.addEventListener('click', (e) => this.onClick(e));
    this.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.close(); });
    document.querySelectorAll('#cart-icon-bubble, [data-jt-cart-mobile]').forEach((link) => {
      link.setAttribute('role', 'button');
      link.setAttribute('aria-haspopup', 'dialog');
      link.addEventListener('click', (e) => { e.preventDefault(); this.open(link); });
    });
  }

  open(trigger) {
    if (trigger) this.trigger = trigger;
    this.classList.add('is-open');
    document.documentElement.classList.add('jt-lock');
    setTimeout(() => this.panel && this.panel.focus({ preventScroll: true }), 50);
  }

  close() {
    this.classList.remove('is-open');
    document.documentElement.classList.remove('jt-lock');
    if (this.trigger && this.trigger.focus) this.trigger.focus({ preventScroll: true });
  }

  setActiveElement(el) { this.trigger = el; }

  getSectionsToRender() {
    return [
      { id: 'cart-drawer', section: 'cart-drawer', selector: '[data-jt-cart-panel]' },
      { id: 'cart-icon-bubble', section: 'cart-icon-bubble', selector: '.shopify-section' },
    ];
  }

  // Called by product-form.js with the /cart/add.js response (which includes `sections`).
  renderContents(state) {
    this.applySections(state.sections || {});
    this.open();
  }

  applySections(sections) {
    const parse = (html) => new DOMParser().parseFromString(html, 'text/html');
    if (sections['cart-drawer']) {
      const el = parse(sections['cart-drawer']).querySelector('[data-jt-cart-panel]');
      if (el) this.mount.innerHTML = el.outerHTML;
    }
    if (sections['cart-icon-bubble']) {
      const doc = parse(sections['cart-icon-bubble']);
      const inner = (doc.querySelector('.shopify-section') || doc.body).innerHTML;
      document.querySelectorAll('#cart-icon-bubble, [data-jt-cart-mobile]').forEach((a) => { a.innerHTML = inner; });
    }
  }

  onClick(e) {
    const close = e.target.closest('[data-jt-cart-close]');
    if (close) { this.close(); return; }
    const qty = e.target.closest('[data-jt-line-qty]');
    if (qty) { this.change(parseInt(qty.dataset.jtLineQty, 10), parseInt(qty.dataset.quantity, 10)); return; }
    const rm = e.target.closest('[data-jt-line-remove]');
    if (rm) this.change(parseInt(rm.dataset.jtLineRemove, 10), 0);
  }

  change(line, quantity) {
    this.mount.classList.add('is-loading');
    fetch(window.routes.cart_change_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        line, quantity,
        sections: this.getSectionsToRender().map((s) => s.id).join(','),
        sections_url: window.location.pathname,
      }),
    })
      .then((r) => r.json())
      .then((state) => {
        if (state.status) {
          const err = this.mount.querySelector('[data-jt-cart-error]');
          if (err) { err.textContent = state.errors || state.message || 'Could not update your cart.'; err.hidden = false; }
          return;
        }
        this.applySections(state.sections || {});
        document.dispatchEvent(new CustomEvent('jt:cart-updated', { detail: state }));
      })
      .catch(() => {})
      .finally(() => this.mount.classList.remove('is-loading'));
  }
}
if (!customElements.get('cart-drawer')) customElements.define('cart-drawer', CartDrawer);
