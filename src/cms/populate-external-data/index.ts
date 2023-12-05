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
  },
]);
/**
 * Function to fetch Offers from an external API.
 * @returns A Promise resolving to an array of Offer objects.
 */
const fetchOffers = async (): Promise<Offer[]> => {
  try {
    const response = await fetch('https://drsgroup.recruitee.com/api/offers/');
    const data = await response.json();
    const offers: Offer[] = data.offers; // Assuming the API response structure
    return offers;
  } catch (error) {
    console.error(error);
    return [];
  }
};

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
  const title = newItem.querySelector<HTMLHeadingElement>('[data-element="title"]');
  const tagsContainer = newItem.querySelector<HTMLDivElement>('[data-element="tags"]'); // Container for tags

  // Set the title text
  if (title) title.textContent = offer.title;

  // Clear existing tags in the container (if any)
  if (tagsContainer) tagsContainer.innerHTML = '';

  // Add each tag as a separate element
  if (tagsContainer && offer.tags) {
    offer.tags.forEach((tag) => {
      const tagElement = document.createElement('span'); // Create a new span for each tag
      tagElement.textContent = tag;
      tagsContainer.appendChild(tagElement); // Append the tag element to the container
    });
  }

  return newItem;
};
/////////
