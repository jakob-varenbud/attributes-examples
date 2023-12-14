import { setupCMS } from './cms/populate-external-data/cms';
import { setupNextBackButtons } from './generalUtils/nextBackButtons';
import { setupToggleElementTags, setupToggleElementCities } from './generalUtils/filterDropDownTags';

// Rufe die Funktion für das darstellen der CMS Daten
setupCMS();

// Rufe die Funktion für die Next-Back-Buttons auf
setupNextBackButtons();

// Rufe die Funktion für das Filterdropdown der Tags auf
setupToggleElementTags();

// Rufe die Funktion für das Filterdropdown der Cities auf
setupToggleElementCities();
