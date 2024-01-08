import type { Offer } from '../types/types';

/**
 * Asynchronously retrieves offers from the recruitee API.
 * This function makes a GET request to the specified URL and
 * parses the response as JSON, extracting the offers array.
 *
 * @returns A promise that resolves with an array of Offer objects,
 *          or an empty array if the request fails.
 */

export async function fetchOffers(): Promise<Offer[]> {
  try {
    const response = await fetch('https://drsgroup.recruitee.com/api/offers/');
    const data = await response.json();
    const offers: Offer[] = data.offers;
    console.log(offers);
    return offers;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * Collects unique tags and cities from an array of offers.
 * This function iterates through each offer, adding each tag and city
 * to a Set to ensure that only unique values are collected. It returns
 * an object containing two arrays: one for tags and one for cities.
 *
 * @param offers An array of Offer objects to be processed.
 * @returns An object containing arrays of unique tags and unique cities.
 */

export function collectTagsAndCitiesAndDepartments(offers: Offer[]) {
  const tagsSet = new Set<string>();
  const citiesSet = new Set<string>();
  const departmentsSet = new Set<string>();

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
