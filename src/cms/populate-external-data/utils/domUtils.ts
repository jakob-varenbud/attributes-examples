import type { Offer } from '../types/types';
/**
 * Function to create a new item based on a template element.
 * @param offer The Offer data to populate the item.
 * @param templateElement The HTML template element for the item.
 * @returns A new HTMLDivElement representing the item.
 */

export function newItem(offer: Offer, templateElement: HTMLDivElement) {
  // Clone the template element to create a new item
  const newItem = templateElement.cloneNode(true) as HTMLDivElement;

  // Query for internal elements of the Collection Item
  const title = newItem.querySelector<HTMLDivElement>('[data-element="title"]');
  const tagsContainer = newItem.querySelector<HTMLDivElement>('[data-element="tags"]'); // Container for tags
  const button = newItem.querySelector<HTMLButtonElement>('[data-element="button"]'); //Selecting the button element
  const cities = newItem.querySelector<HTMLDivElement>('[data-element="cities"]'); // Select the div where the city shoulb be placed in
  const departments = newItem.querySelector<HTMLDivElement>('[data-element="department"]'); //Select the div where the department should be placed in
  // Set the title text
  if (title) title.textContent = offer.title;

  // Clear existing content in the container (tags,cities,departments)
  if (tagsContainer) tagsContainer.innerHTML = '';
  if (cities) cities.innerHTML = '';
  if (departments) departments.innerHTML = '';

  // Add each tag as a separate element
  if (tagsContainer && offer.tags) {
    offer.tags.forEach((tag) => {
      const tagElement = document.createElement('span'); // Create a new span for each tag - tagElemet als Konstante Var -/tag als Funktionsname
      tagElement.textContent = tag;
      tagsContainer.appendChild(tagElement); // Append the tag element to the container
    });
  }

  // Set the button link to open in a new tab
  if (button && offer.careers_url) {
    button.setAttribute('onclick', `window.open('${offer.careers_url}', '_blank')`);
  }

  //Add each city as a separate element
  if (cities && offer.city) {
    const cityElement = document.createElement('span'); // Create a new span for the city
    cityElement.textContent = offer.city; // Set the text content to the city from the offer
    cities.appendChild(cityElement); // Append the city element to the cities container
  }

  //Add each deartment as a separte element
  if (departments && offer.department) {
    const departmentElement = document.createElement('span'); //Create new span for the deparmtment
    departmentElement.textContent = offer.department; //Set the text content to the department from the offer
    departments.appendChild(departmentElement); //Append the department element to the departments container
  }
  return newItem;
}

/**
 * Creates a new radio filter element based on a provided template.
 * This function clones a template label element and modifies it
 * to create a tag-specific radio filter. The tag is used to set
 * the text and value attributes of the label's child elements.
 * The function ensures that the created filter has a unique identifier.
 *
 * @param tag The string used to set the text content and value of the new filter.
 * @param templateElement The HTMLLabelElement to be cloned and modified as the new filter.
 * @returns An HTMLElement representing the newly created radio filter, or null if essential elements are missing.
 */

//Creates a new radio filter from the template + external data
export function createFilter(tag: string, templateElement: HTMLLabelElement): HTMLElement | null {
  // Klonen des Template-Elements
  const newFilter = templateElement.cloneNode(true) as HTMLLabelElement;

  // Innere Elemente abfragen
  const label = newFilter.querySelector('span');
  const input = newFilter.querySelector('input');

  // Überprüfen, ob die erforderlichen Elemente gefunden wurden
  if (!label || !input) return null;

  // Innere Elemente befüllen
  label.textContent = tag; // Das 'label' wird mit dem Tag-Text befüllt
  input.value = tag; // Das 'input' erhält als Wert das Tag
  input.id = `radio-${tag}`; // Die ID des 'input' wird gesetzt, um sie einzigartig zu machen

  return newFilter; // Das modifizierte und geklonte Element wird zurückgegeben
}

export function createCityFilter(city: string, templateElement: HTMLLabelElement): HTMLElement | null {
  const newFilter = templateElement.cloneNode(true) as HTMLLabelElement;
  const label = newFilter.querySelector('span');
  const input = newFilter.querySelector('input');

  if (!label || !input) return null;

  label.textContent = city;
  input.value = city;
  input.id = `radio-city-${city}`;
  return newFilter;
}

export function createDepartmentFilter(department: string, templateElement: HTMLLabelElement): HTMLElement | null {
  const newFilter = templateElement.cloneNode(true) as HTMLLabelElement;
  const label = newFilter.querySelector('span');
  const input = newFilter.querySelector('input');

  if (!label || !input) return null;

  label.textContent = department;
  input.value = department;
  input.id = `radio-${department}`;
  return newFilter;
}
