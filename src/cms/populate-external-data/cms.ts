// src/cms/populate-external-data/cms.ts
import { fetchOffers, collectTagsAndCities } from './utils/apiUtils';
import { newItem, createFilter, createCityFilter } from './utils/domUtils';
import type { CMSList } from './types/CMSList';
import type { CMSFilters } from './types/CMSFilters';

export const setupCMS = () => {
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
  window.fsAttributes.push([
    'cmsfilter',
    async (filtersInstances: CMSFilters[]) => {
      //Get the filters instance
      const [filtersInstance] = filtersInstances;

      // Get the radio template elements for tags and cities
      const filtersTagTemplateElement = filtersInstance.form.querySelector<HTMLLabelElement>('[data-element="filter"]');
      const filtersCityTemplateElement =
        filtersInstance.form.querySelector<HTMLLabelElement>('[data-element="cityfilter"]');

      if (!filtersTagTemplateElement || !filtersCityTemplateElement) return;

      // Get the parent elements of the tag and city radios
      const tagWrapperElement = filtersTagTemplateElement.parentElement;
      const cityWrapperElement = filtersCityTemplateElement.parentElement;

      if (!tagWrapperElement || !cityWrapperElement) return;

      // Remove the template radio elements
      filtersTagTemplateElement.remove();
      filtersCityTemplateElement.remove();

      // Fetch the offers again
      const offers = await fetchOffers();

      // Collect tags and cities
      const { tags, cities } = collectTagsAndCities(offers);

      // Create and append tag filters
      tags.forEach((tag) => {
        const newTagFilter = createFilter(tag, filtersTagTemplateElement);
        if (!newTagFilter) return;
        tagWrapperElement.append(newTagFilter);
      });

      // Create and append city filters
      cities.forEach((city) => {
        const newCityFilter = createCityFilter(city, filtersCityTemplateElement);
        if (!newCityFilter) return;
        cityWrapperElement.append(newCityFilter);
      });

      // Sync CMSFilters instance to read the new filters data
      filtersInstance.storeFiltersData();
    },
  ]);
};
