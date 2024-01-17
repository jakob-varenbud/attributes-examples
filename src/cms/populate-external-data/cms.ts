// src/cms/populate-external-data/cms.ts
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
      const [filterInstance] = filtersInstances;

      // listener for the filterInstance (called everytime the filters changed)
      filterInstance.listInstance.on('renderitems', (renderedItems) => {
        // call sub method to get items matching ALL filters
        filterAND(renderedItems, filterInstance.filtersData);
    });

      // Get the radio template elements for tags, cities and departments
      const filtersTagTemplateElement = filterInstance.form.querySelector<HTMLLabelElement>('[data-element="filter"]');
      const filtersCityTemplateElement =
        filterInstance.form.querySelector<HTMLLabelElement>('[data-element="cityfilter"]');
      const filtersDepartmentTemplateElement = filterInstance.form.querySelector<HTMLLabelElement>(
        '[data-element="departmentfilter"]'
      );

      // Ensure that all filter elements are present
      if (!filtersTagTemplateElement || !filtersCityTemplateElement || !filtersDepartmentTemplateElement) return;

      // Get the parent elements of the tag and city radios
      const tagWrapperElement = filtersTagTemplateElement.parentElement;
      const cityWrapperElement = filtersCityTemplateElement.parentElement;
      const departmentWrapperElement = filtersDepartmentTemplateElement.parentElement;

      if (!tagWrapperElement || !cityWrapperElement || !departmentWrapperElement) return;

      // Remove the template radio elements
      filtersTagTemplateElement.remove();
      filtersCityTemplateElement.remove();
      filtersDepartmentTemplateElement.remove();

      // Fetch the offers again
      const offers = await fetchOffers();

      // Collect tags and cities
      const { tags, cities, departments } = collectTagsAndCitiesAndDepartments(offers);

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

      // Create and append department filters
      departments.forEach((department) => {
        const newDepartmentFilter = createDepartmentFilter(department, filtersDepartmentTemplateElement);
        if (!newDepartmentFilter) return;
        departmentWrapperElement.append(newDepartmentFilter);
      });

      // Sync CMSFilters instance to read the new filters data
      filterInstance.storeFiltersData();
    },
  ]);
};

const filterAND = function (renderItems, filterData) {

  //console.log('fData', fData[0].values.values())

  // get values of all filters
  const filterValues = filterData[0].values;

  // iterate through all filters
  filterValues.forEach((value) => {
    console.log('value: ' + value)
  });

  //const filteredItems = x[0].props.value.find(item => item === 'Werkstatt')
  //console.log(x[0].props.category.values)

  // test: filter all items by fixed filter value
  // todo: implement dynamic filter using the current filter values from above
  const filteredItems = renderItems.filter(item => item.props.category.values.has('Werkstatt'))
  //console.clear()
  console.log(filteredItems)
}
