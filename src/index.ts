import { setupCMS } from './cms/populate-external-data/cms';
import { setupNextBackButtons } from './generalUtils/nextBackButtons';
import { setupToggleElement } from './generalUtils/filterDropDownTags';

// Rufe die Funktion für das darstellen der CMS Daten
setupCMS();

// Rufe die Funktion für die Next-Back-Buttons auf
setupNextBackButtons();

// Setze das Dropdown für Tags
setupToggleElement('head-tags', 'radio-tags-wrap');

// Setze das Dropdown für Cities
setupToggleElement('head-ctiy', 'radio-city-wrap');
