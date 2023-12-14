// src/utils/nextBackButtons.js

const setupNextBackButtons = () => {
  let Webflow = window.Webflow || [];
  Webflow.push(function () {
    const leftArrow = $('#flowbaseSlider .w-slider-arrow-left');
    const rightArrow = $('#flowbaseSlider .w-slider-arrow-right');

    $('#flowbaseSlider')
      .on('click', '.back-button', function () {
        leftArrow.trigger('tap');
      })
      .on('click', '.next-button', function () {
        rightArrow.trigger('tap');
      });
  });
};

export { setupNextBackButtons };
