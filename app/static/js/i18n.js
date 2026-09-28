class I18n {
  constructor() {
    this.currentLanguage = localStorage.getItem('language') || 'th';
    this.translations = {};
  }

  async init() {
    try {
      const response = await fetch(`/static/locales/${this.currentLanguage}.json`);
      if (!response.ok) throw new Error(`Translation load failed: ${response.status}`);
      this.translations = await response.json();
      document.documentElement.lang = this.currentLanguage;
      this.updatePageText();
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  }

  t(key) {
    return this.translations[key] || key;
  }

  async setLanguage(language) {
    this.currentLanguage = language;
    localStorage.setItem('language', language);
    await this.init();
  }

  updatePageText() {
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = this.t(element.dataset.i18n);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      element.placeholder = this.t(element.dataset.i18nPlaceholder);
    });
  }

  getLanguage() {
    return this.currentLanguage;
  }
}

const i18n = new I18n();

window.addEventListener('DOMContentLoaded', () => {
  i18n.init();
});
