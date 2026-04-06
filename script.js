document.addEventListener('DOMContentLoaded', () => {
  if (!window.LP_CONFIG) {
    console.error('LP_CONFIG not found. Please check config.js');
    return;
  }

  const config = window.LP_CONFIG;

  // 1. Simple Data Binding (Text & HTML)
  const bindText = () => {
    const textElements = document.querySelectorAll('[data-bind]');
    textElements.forEach(el => {
      const path = el.getAttribute('data-bind');
      const value = path.split('.').reduce((obj, key) => obj && obj[key], config);
      if (value !== undefined) {
        el.innerHTML = value; // <br>を有効にするためinnerHTMLを使用
      }
    });
  };

  // 2. Attribute Binding (src, href, alt)
  const bindAttributes = () => {
    const attributes = ['src', 'href', 'alt'];
    attributes.forEach(attr => {
      const elements = document.querySelectorAll(`[data-bind-${attr}]`);
      elements.forEach(el => {
        const path = el.getAttribute(`data-bind-${attr}`);
        const value = path.split('.').reduce((obj, key) => obj && obj[key], config);
        if (value !== undefined) {
          el.setAttribute(attr, value);
        }
      });
    });
  };

  // 3. List Binding (Nav, Manga, Problems, etc.)
  const bindLists = () => {
    const listElements = document.querySelectorAll('[data-bind-list]');
    listElements.forEach(container => {
      const path = container.getAttribute('data-bind-list');
      const items = path.split('.').reduce((obj, key) => obj && obj[key], config);
      
      if (Array.isArray(items)) {
        // 現在のHTML構造からテンプレートを推測し、中身を空にしてから生成
        const template = container.innerHTML;
        container.innerHTML = '';
        
        items.forEach(item => {
          let html = template;
          // 各プロパティを置換 (例: [data-bind="label"] -> item.label)
          Object.keys(item).forEach(key => {
            const regex = new RegExp(`\\[data-bind(-[a-z]+)?="${key}"\\]`, 'g');
            // 属性置換
            html = html.replace(/src=""|href=""|alt=""/g, (match) => {
                if(match.includes('src') && item.imageSrc) return `src="${item.imageSrc}"`;
                if(match.includes('href') && item.href) return `href="${item.href}"`;
                if(match.includes('alt') && item.imageAlt) return `alt="${item.imageAlt}"`;
                return match;
            });
            // テキスト置換（タグの中身）
            const textRegex = new RegExp(`(>[^<]*)(\\[data-bind="${key}"\\])([^<]*<)`, 'g');
            html = html.replace(textRegex, `$1${item[key] || ''}$3`);
          });
          container.insertAdjacentHTML('beforeend', html);
        });
      }
    });
  };

  bindText();
  bindAttributes();
  bindLists();
  document.body.classList.add('lp-loaded');
});
