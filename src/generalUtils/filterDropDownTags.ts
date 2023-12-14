export const setupToggleElementTags = () => {
  document.addEventListener('DOMContentLoaded', () => {
    const head = document.getElementById('head-tags');
    const radiowrap = document.getElementById('radio-tags-wrap');

    head?.addEventListener('click', () => {
      if (radiowrap?.style.height === 'auto') {
        radiowrap.style.height = '0';
      } else {
        radiowrap.style.height = 'auto';
      }
    });
  });
};

export const setupToggleElementCities = () => {
  document.addEventListener('DOMContentLoaded', () => {
    const head = document.getElementById('head-ctiy');
    const radiowrap = document.getElementById('radio-city-wrap');

    head?.addEventListener('click', () => {
      if (radiowrap?.style.height === 'auto') {
        radiowrap.style.height = '0';
      } else {
        radiowrap.style.height = 'auto';
      }
    });
  });
};
