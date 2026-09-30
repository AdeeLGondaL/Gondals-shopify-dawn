// Desktop header menu: hover-intent open, animated close, clickable top-level items.
// Dawn's menus are native <details>, which open/close instantly and only on click.
(function () {
  var hoverable = window.matchMedia('(hover: hover) and (pointer: fine)');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var OPEN_DELAY = 70;
  var LEAVE_DELAY = 180;
  var CLOSE_MS = 160;
  var menus = [];

  document.querySelectorAll('.header__inline-menu header-menu > details').forEach(function (details) {
    var summary = details.querySelector('summary');
    var item = details.closest('li');
    var openTimer, leaveTimer, closeTimer;

    function open() {
      clearTimeout(closeTimer);
      details.classList.remove('is-closing');
      summary.setAttribute('aria-expanded', 'true');
      if (details.open) return;
      menus.forEach(function (m) { if (m.details !== details) m.close(true); });
      details.open = true;
    }

    function close(instant) {
      clearTimeout(openTimer);
      clearTimeout(leaveTimer);
      if (!details.open) return;
      summary.setAttribute('aria-expanded', 'false');
      if (instant || reduceMotion.matches) {
        clearTimeout(closeTimer);
        details.classList.remove('is-closing');
        details.open = false;
        return;
      }
      if (details.classList.contains('is-closing')) return;
      details.classList.add('is-closing');
      closeTimer = setTimeout(function () {
        details.classList.remove('is-closing');
        details.open = false;
      }, CLOSE_MS);
    }

    item.addEventListener('mouseenter', function () {
      if (!hoverable.matches) return;
      clearTimeout(leaveTimer);
      if (details.classList.contains('is-closing')) return open();
      openTimer = setTimeout(open, OPEN_DELAY);
    });

    item.addEventListener('mouseleave', function () {
      if (!hoverable.matches) return;
      clearTimeout(openTimer);
      leaveTimer = setTimeout(function () { close(); }, LEAVE_DELAY);
    });

    summary.addEventListener('click', function (event) {
      // Mouse click on a hover-opened item goes to its collection, like a normal link.
      // Keyboard (detail === 0) and touch keep the native open/close toggle.
      var href = summary.dataset.gondalsHref;
      if (hoverable.matches && event.detail > 0 && href) {
        event.preventDefault();
        window.location.href = href;
        return;
      }
      if (details.open && !details.classList.contains('is-closing')) {
        event.preventDefault();
        close();
      }
    });

    details.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && details.open) {
        close(true);
        summary.focus();
      }
    });

    menus.push({ details: details, close: close });
  });
})();
