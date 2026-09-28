// i18n Management for ProjectFlow

class I18n {
  constructor() {
    this.currentLanguage = localStorage.getItem('language') || 'en';
    this.translations = {};
  }

  async init() {
    try {
      const response = await fetch(`/static/locales/${this.currentLanguage}.json`);
      this.translations = await response.json();
      document.documentElement.lang = this.currentLanguage;
    } catch (error) {
      console.error('Failed to load translations:', error);
      this.translations = {};
    }
  }

  t(key) {
    return this.translations[key] || key;
  }

  setLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem('language', lang);
    this.init();
    this.updatePageText();
  }

  updatePageText() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = this.t(key);
      } else if (el.tagName === 'OPTION') {
        el.textContent = this.t(key);
      } else {
        el.textContent = this.t(key);
      }
    });

    // Update select options
    document.querySelectorAll('select option').forEach((option) => {
      const key = option.getAttribute('data-i18n');
      if (key) {
        option.textContent = this.t(key);
      }
    });
  }

  getLanguage() {
    return this.currentLanguage;
  }
}

// Create global i18n instance
const i18n = new I18n();

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => i18n.init().then(() => i18n.updatePageText()));
} else {
  i18n.init().then(() => i18n.updatePageText());
}
