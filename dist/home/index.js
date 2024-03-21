"use strict";
(() => {
  // home/cms/populate-external-data/utils/apiUtils.ts
  async function fetchOffers() {
    try {
      const response = await fetch("https://drsgroup.recruitee.com/api/offers/");
      const data = await response.json();
      let offers = data.offers;
      offers = offers.filter((offer) => offer.country !== "Vereinigte Staaten von Amerika");
      offers = offers.filter((offer) => offer.country !== "United States");
      console.log(offers);
      return offers;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  function collectTagsAndCitiesAndDepartments(offers) {
    const tagsSet = /* @__PURE__ */ new Set();
    const citiesSet = /* @__PURE__ */ new Set();
    const departmentsSet = /* @__PURE__ */ new Set();
    offers.forEach((offer) => {
      if (offer.tags) {
        offer.tags.forEach((tag) => tagsSet.add(tag));
      }
      if (offer.city) {
        citiesSet.add(offer.city);
      }
      if (offer.department) {
        departmentsSet.add(offer.department);
      }
    });
    return { tags: [...tagsSet], cities: [...citiesSet], departments: [...departmentsSet] };
  }

  // home/cms/populate-external-data/utils/domUtils.ts
  function newItem(offer, templateElement) {
    const newItem2 = templateElement.cloneNode(true);
    const title = newItem2.querySelector('[data-element="title"]');
    const tagsContainer = newItem2.querySelector('[data-element="tags"]');
    const button = newItem2.querySelector('[data-element="button"]');
    const cities = newItem2.querySelector('[data-element="cities"]');
    const departments = newItem2.querySelector('[data-element="department"]');
    if (title)
      title.textContent = offer.title;
    if (tagsContainer)
      tagsContainer.innerHTML = "";
    if (cities)
      cities.innerHTML = "";
    if (departments)
      departments.innerHTML = "";
    if (tagsContainer && offer.tags) {
      offer.tags.forEach((tag) => {
        const tagElement = document.createElement("span");
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
      });
    }
    if (button && offer.careers_url) {
      button.setAttribute("onclick", `window.open('${offer.careers_url}', '_blank')`);
    }
    if (cities && offer.city) {
      const cityElement = document.createElement("span");
      cityElement.textContent = offer.city;
      cities.appendChild(cityElement);
    }
    if (departments && offer.department) {
      const departmentElement = document.createElement("span");
      departmentElement.textContent = offer.department;
      departments.appendChild(departmentElement);
    }
    return newItem2;
  }
  function createFilter(tag, templateElement) {
    const newFilter = templateElement.cloneNode(true);
    const label = newFilter.querySelector("span");
    const input = newFilter.querySelector("input");
    if (!label || !input)
      return null;
    label.textContent = tag;
    input.value = tag;
    input.id = `checkbox-${tag}`;
    return newFilter;
  }
  function createCityFilter(city, templateElement) {
    const newFilter = templateElement.cloneNode(true);
    const label = newFilter.querySelector("span");
    const input = newFilter.querySelector("input");
    if (!label || !input)
      return null;
    label.textContent = city;
    input.value = city;
    input.id = `checkbox-city-${city}`;
    return newFilter;
  }
  function createDepartmentFilter(department, templateElement) {
    const newFilter = templateElement.cloneNode(true);
    const label = newFilter.querySelector("span");
    const input = newFilter.querySelector("input");
    if (!label || !input)
      return null;
    label.textContent = department;
    input.value = department;
    input.id = `checkbox-${department}`;
    return newFilter;
  }

  // home/cms/populate-external-data/cms.ts
  var setupCMS = () => {
    window.fsAttributes = window.fsAttributes || [];
    window.fsAttributes.push([
      "cmsload",
      async (listInstances) => {
        const [listInstance] = listInstances;
        const [item] = listInstance.items;
        const itemTemplateElement = item.element;
        const offers = await fetchOffers();
        listInstance.clearItems();
        const newItems = offers.map((offer) => newItem(offer, itemTemplateElement));
        await listInstance.addItems(newItems);
      }
    ]);
    window.fsAttributes.push([
      "cmsfilter",
      async (filtersInstances) => {
        const [filtersInstance] = filtersInstances;
        const filtersTagTemplateElement = filtersInstance.form.querySelector('[data-element="filter"]');
        const filtersCityTemplateElement = filtersInstance.form.querySelector('[data-element="cityfilter"]');
        const filtersDepartmentTemplateElement = filtersInstance.form.querySelector(
          '[data-element="departmentfilter"]'
        );
        if (!filtersTagTemplateElement || !filtersCityTemplateElement || !filtersDepartmentTemplateElement)
          return;
        const tagWrapperElement = filtersTagTemplateElement.parentElement;
        const cityWrapperElement = filtersCityTemplateElement.parentElement;
        const departmentWrapperElement = filtersDepartmentTemplateElement.parentElement;
        if (!tagWrapperElement || !cityWrapperElement || !departmentWrapperElement)
          return;
        filtersTagTemplateElement.remove();
        filtersCityTemplateElement.remove();
        filtersDepartmentTemplateElement.remove();
        const offers = await fetchOffers();
        const { tags, cities, departments } = collectTagsAndCitiesAndDepartments(offers);
        tags.forEach((tag) => {
          const newTagFilter = createFilter(tag, filtersTagTemplateElement);
          if (!newTagFilter)
            return;
          tagWrapperElement.append(newTagFilter);
        });
        cities.forEach((city) => {
          const newCityFilter = createCityFilter(city, filtersCityTemplateElement);
          if (!newCityFilter)
            return;
          cityWrapperElement.append(newCityFilter);
        });
        departments.forEach((department) => {
          const newDepartmentFilter = createDepartmentFilter(department, filtersDepartmentTemplateElement);
          if (!newDepartmentFilter)
            return;
          departmentWrapperElement.append(newDepartmentFilter);
        });
        filtersInstance.storeFiltersData();
      }
    ]);
  };

  // home/generalUtils/nextBackButtons.ts
  var setupNextBackButtons = () => {
    let Webflow = window.Webflow || [];
    Webflow.push(function() {
      const leftArrow = $("#flowbaseSlider .w-slider-arrow-left");
      const rightArrow = $("#flowbaseSlider .w-slider-arrow-right");
      $("#flowbaseSlider").on("click", ".back-button", function() {
        leftArrow.trigger("tap");
      }).on("click", ".next-button", function() {
        rightArrow.trigger("tap");
      });
    });
  };
  var setupNextBackButtons2 = () => {
    let Webflow = window.Webflow || [];
    Webflow.push(function() {
      const leftArrow = $("#flowbaseSlider2 .w-slider-arrow-left");
      const rightArrow = $("#flowbaseSlider2 .w-slider-arrow-right");
      $("#flowbaseSlider2").on("click", ".back-button", function() {
        leftArrow.trigger("tap");
      }).on("click", ".next-button", function() {
        rightArrow.trigger("tap");
      });
    });
  };

  // home/generalUtils/filterDropDownTags.ts
  var setupToggleElement = (headId, radioWrapId) => {
    document.addEventListener("DOMContentLoaded", () => {
      const head = document.getElementById(headId);
      const radiowrap = document.getElementById(radioWrapId);
      head?.addEventListener("click", () => {
        radiowrap.style.height = radiowrap.style.height === "auto" ? "0" : "auto";
      });
    });
  };

  // home/index.ts
  setupCMS();
  setupNextBackButtons();
  setupNextBackButtons2();
  setupToggleElement("head-tags", "radio-tags-wrap");
  setupToggleElement("head-ctiy", "radio-city-wrap");
  setupToggleElement("head-department", "radio-department-wrap");
})();
