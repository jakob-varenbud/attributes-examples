export const setupToggleElement = (headId, radioWrapId) => {
  document.addEventListener('DOMContentLoaded', () => {
    const head = document.getElementById(headId);
    const radiowrap = document.getElementById(radioWrapId);

    head?.addEventListener('click', () => {
      radiowrap.style.height = radiowrap.style.height === 'auto' ? '0' : 'auto';
    });
  });
};
