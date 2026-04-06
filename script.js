document.addEventListener('DOMContentLoaded', () => {
  const config = window.LP_CONFIG;
  if (!config) return;

  const bind = (el, data) => {
    // Text/HTML Binding
    const textPath = el.getAttribute('data-bind');
    if (textPath) {
      const val = textPath.split('.').reduce((o, i) => o?.[i], data);
      if (val !== undefined) el.innerHTML = val;
    }
    // Attribute Binding
    ['src', 'href', 'alt'].forEach(attr => {
      const path = el.getAttribute(`data-bind-${attr}`);
      if (path) {
        const val = path.split('.').reduce((o, i) => o?.[i], data);
        if (val !== undefined) el.setAttribute(attr, val);
      }
    });
  };

  // Process Lists
  document.querySelectorAll('[data-bind-list]').forEach(container => {
    const path = container.getAttribute('data-bind-list');
    const items = path.split('.').reduce((o, i) => o?.[i], config);
    const template = container.firstElementChild?.cloneNode(true);
    if (!items || !template) return;
    container.innerHTML = '';
    items.forEach(item => {
      const clone = template.cloneNode(true);
      bind(clone, item);
      clone.querySelectorAll('[data-bind], [data-bind-src], [data-bind-href], [data-bind-alt]').forEach(child => bind(child, item));
      container.appendChild(clone);
    });
  });

  // Process Single Elements
  document.querySelectorAll('[data-bind]:not([data-bind-list] *), [data-bind-src], [data-bind-href], [data-bind-alt]').forEach(el => bind(el, config));
});
