// Free-shipping bar: the cart drawer/page re-renders via innerHTML, so the fill would jump.
// Remember the last percentage per placement and animate from it to the new value.
if (!customElements.get('gondals-free-shipping')) {
  const lastPercent = new Map();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  customElements.define(
    'gondals-free-shipping',
    class GondalsFreeShipping extends HTMLElement {
      connectedCallback() {
        const fill = this.querySelector('.gondals-freeship__fill');
        const key = this.dataset.key;
        const target = parseFloat(this.dataset.percent) || 0;
        const from = lastPercent.has(key) ? lastPercent.get(key) : target;
        lastPercent.set(key, target);

        if (!fill || from === target || reduceMotion.matches) return;

        fill.style.transition = 'none';
        fill.style.width = `${from}%`;
        fill.getBoundingClientRect();
        fill.style.transition = '';
        fill.style.width = `${target}%`;
      }
    }
  );
}
