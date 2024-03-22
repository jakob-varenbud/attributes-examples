import { fetchOffers, collectTagsAndCitiesAndDepartments } from './utils/apiUtils';
import { newItem, createFilter, createCityFilter, createDepartmentFilter } from './utils/domUtils';
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

      // Get the radio template elements for tags, cities and departments
      const filtersTagTemplateElement = filtersInstance.form.querySelector<HTMLLabelElement>('[data-element="filter"]');
      const secondFiltersTagTemplateElement = filtersInstance.form.querySelector<HTMLLabelElement>(
        '[data-element="second-filter"]'
      );
      const filtersCityTemplateElement =
        filtersInstance.form.querySelector<HTMLLabelElement>('[data-element="cityfilter"]');
      const filtersDepartmentTemplateElement = filtersInstance.form.querySelector<HTMLLabelElement>(
        '[data-element="departmentfilter"]'
      );

      // Ensure that all filter elements are present
      if (
        !filtersTagTemplateElement ||
        !secondFiltersTagTemplateElement ||
        !filtersCityTemplateElement ||
        !filtersDepartmentTemplateElement
      )
        return;

      // Get the parent elements of the tag, city, and departement checkoboxes
      const tagWrapperElement = filtersTagTemplateElement.parentElement;
      const cityWrapperElement = filtersCityTemplateElement.parentElement;
      const departmentWrapperElement = filtersDepartmentTemplateElement.parentElement;
      const secondtagWrapperElement = secondFiltersTagTemplateElement.parentElement;

      if (!tagWrapperElement || !secondtagWrapperElement || !cityWrapperElement || !departmentWrapperElement) return;

      // Remove the template radio elements
      filtersTagTemplateElement.remove();
      filtersCityTemplateElement.remove();
      filtersDepartmentTemplateElement.remove();
      secondFiltersTagTemplateElement.remove();

      // Fetch the offers again
      const offers = await fetchOffers();

      // Collect tags and cities
      const { tags, cities, departments } = collectTagsAndCitiesAndDepartments(offers);

      // Create and append tag filters for the first set of tags
      tags.forEach((tag) => {
        const newTagFilter = createFilter(tag, filtersTagTemplateElement);
        if (!newTagFilter) return;
        tagWrapperElement.append(newTagFilter);
      });

      // Create and append tag filters for the second set of tags, specifically those at index 1 from each offer
      const seenSecondTags = new Set(); // Verwende ein Set, um doppelte Tags zu vermeiden
      offers.forEach((offer) => {
        if (offer.tags && offer.tags.length > 1) {
          const secondTag = offer.tags[1]; // Nehme das zweite Tag aus jedem Angebot
          // Stelle sicher, dass dieses Tag noch nicht verarbeitet wurde
          if (!seenSecondTags.has(secondTag)) {
            const newSecondTagFilter = createFilter(secondTag, secondFiltersTagTemplateElement);
            if (newSecondTagFilter) {
              secondtagWrapperElement.append(newSecondTagFilter);
              seenSecondTags.add(secondTag); // Füge dieses Tag zum Set hinzu, um Duplikate zu vermeiden
            }
          }
        }
      });

      // Create and append city filters
      cities.forEach((city) => {
        const newCityFilter = createCityFilter(city, filtersCityTemplateElement);
        if (!newCityFilter) return;
        cityWrapperElement.append(newCityFilter);
      });

      // Create and append department filters
      departments.forEach((department) => {
        const newDepartmentFilter = createDepartmentFilter(department, filtersDepartmentTemplateElement);
        if (!newDepartmentFilter) return;
        departmentWrapperElement.append(newDepartmentFilter);
      });

      // Sync CMSFilters instance to read the new filters data
      filtersInstance.storeFiltersData();
    },
  ]);
};
