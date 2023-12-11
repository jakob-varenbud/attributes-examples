import type { CMSList } from 'src/types/CMSList';
import type { CMSFilters } from '../../types/CMSFilters';
import type { Offer } from './types';

/**
 * Populate CMS Data from an external API.
 */
window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsload',
  async (listInstances: CMSList[]) => {
    // Retrieve the list instance from the CMS
    const [listInstance] = listInstances;

    // Save a copy of the first item as a template
    const [item] = listInstance.items;
    const itemTemplateElement = item.element;

    // Fetch external data (offers)
    const offers = await fetchOffers();

    // Remove placeholder items from the list
    listInstance.clearItems();

    // Create new items based on the fetched offers
    const newItems = offers.map((offer) => newItem(offer, itemTemplateElement));

    // Add the new items to the list
    await listInstance.addItems(newItems);

    window.fsAttributes.push([
      'cmsfilter',
      async (filtersInstances: CMSFilters[]) => {
        //Get the filters instance
        const [filtersInstance] = filtersInstances;

        // Get the radio template element
        const filtersRadioTemplateElement =
          filtersInstance.form.querySelector<HTMLLabelElement>('[data-element="filter"]');
        if (!filtersRadioTemplateElement) return;

        //Get the parent of the radios - to place the radios
        const filtersWrapperElement = filtersRadioTemplateElement.parentElement;
        if (!filtersWrapperElement) return;

        //Remove the template radio element
        filtersRadioTemplateElement.remove();

        //Collect all the tags of the products
        const tags = collectTags(offers);

        // Erstellt neue Radiofilter für jedes Tag und fügt sie dem Elternelement hinzu
        tags.forEach((tag) => {
          const newFilter = createFilter(tag, filtersRadioTemplateElement);
          if (!newFilter) return;
          filtersWrapperElement.append(newFilter);
        });

        console.log(filtersInstance);
        // Sync CMSFilters instance to read the new filters data
        filtersInstance.storeFiltersData();
      },
    ]);
  },
]);

/**
 * Function to fetch Offers from an external API.
 * @returns A Promise resolving to an array of Offer objects.
 */
async function fetchOffers(): Promise<Offer[]> {
  try {
    const response = await fetch('https://drsgroup.recruitee.com/api/offers/');
    const data = await response.json();
    const offers: Offer[] = data.offers;
    console.log(offers); // Assuming the API response structure
    return offers;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * Function to create a new item based on a template element.
 * @param offer The Offer data to populate the item.
 * @param templateElement The HTML template element for the item.
 * @returns A new HTMLDivElement representing the item.
 */
const newItem = (offer: Offer, templateElement: HTMLDivElement) => {
  // Clone the template element to create a new item
  const newItem = templateElement.cloneNode(true) as HTMLDivElement;

  // Query for internal elements of the Collection Item
  const title = newItem.querySelector<HTMLDivElement>('[data-element="title"]');
  const tagsContainer = newItem.querySelector<HTMLDivElement>('[data-element="tags"]'); // Container for tags
  const button = newItem.querySelector<HTMLButtonElement>('[data-element="button"]'); //Selecting the button element
  const cities = newItem.querySelector<HTMLDivElement>('[data-element="cities"]'); // Select the div where the city shoulb be placed in
  // Set the title text
  if (title) title.textContent = offer.title;

  // Clear existing content in the container (tags,cities)
  if (tagsContainer) tagsContainer.innerHTML = '';
  if (cities) cities.innerHTML = '';

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

  return newItem;
};

//////

//+++++++Collects unique records of each tag of the products++++++++
const collectTags = (offers: Offer[]) => {
  const tagsSet = new Set<string>();

  offers.forEach((offer) => {
    // Überprüfen, ob tags vorhanden sind und nicht leer sind
    if (offer.tags && offer.tags.length > 0) {
      offer.tags.forEach((tag) => {
        tagsSet.add(tag);
      });
    }
  });

  return [...tagsSet];
};

//Creates a new radio filter from the template + external data

const createFilter = (tag: string, templateElement: HTMLLabelElement): HTMLElement | null => {
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
};
