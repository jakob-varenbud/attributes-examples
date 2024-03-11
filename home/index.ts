import { setupCMS } from './cms/populate-external-data/cms';
import { setupNextBackButtons, setupNextBackButtons2 } from './generalUtils/nextBackButtons';
import { setupToggleElement } from './generalUtils/filterDropDownTags';

// Rufe die Funktion für das darstellen der CMS Daten
setupCMS();

// Rufe die Funktion für die Next-Back-Buttons auf
setupNextBackButtons();

//Call the function for Nex-Back-Buttons in the second slider
setupNextBackButtons2();

// Setze das Dropdown für Tags
setupToggleElement('head-tags', 'radio-tags-wrap');

// Setze das Dropdown für Cities
setupToggleElement('head-ctiy', 'radio-city-wrap');

// Setze das Dropdown für Department
setupToggleElement('head-department', 'radio-department-wrap');
