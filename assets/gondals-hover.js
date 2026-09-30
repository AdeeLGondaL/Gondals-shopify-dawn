// Liquid fill buttons: CSS drops the fill in from the top on hover; this makes it
// leave through the bottom instead of retracting upwards, then resets it silently.
(function () {
  var SELECTOR = [
    '.gondals-pill', '.gondals-hero__btn', '.gondals-hero__arrow', '.gondals-row__arrow', '.gondals-buy-now__button',
    '.product .product-form__submit', '.gondals-sticky-atc__btn', '#CartDrawer-Checkout', '.cart__checkout-button',
    '.button:not(.button--tertiary)'
  ].join(',');
  var hoverable = window.matchMedia('(hover: hover)');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var DURATION = 500;

  document.addEventListener('mouseover', function (event) {
    var button = event.target.closest && event.target.closest(SELECTOR);
    if (!button || button.contains(event.relatedTarget)) return;
    clearTimeout(button._gondalsFill);
    button.classList.remove('is-fill-out', 'is-fill-reset');
  });

  document.addEventListener('mouseout', function (event) {
    var button = event.target.closest && event.target.closest(SELECTOR);
    if (!button || button.contains(event.relatedTarget) || !hoverable.matches || reduceMotion.matches) return;
    button.classList.add('is-fill-out');
    clearTimeout(button._gondalsFill);
    button._gondalsFill = setTimeout(function () {
      button.classList.add('is-fill-reset');
      button.classList.remove('is-fill-out');
      void button.offsetWidth;
      button.classList.remove('is-fill-reset');
    }, DURATION);
  });
})();
