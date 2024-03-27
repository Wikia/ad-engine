// @ts-strict-ignore
import { context } from '../services';

const earth = 'XX';

export const geoService = {
	isProperCountry,
	isProperGeo,
	getContinentCode,
	getCountryCode,
	getRegionCode,
};

function containsEarth(countryList: string[]): boolean {
	return countryList.indexOf(earth) > -1;
}

/**
 * Return country code based on cookie
 */
function getCountryCode(): string | undefined {
	return context.get('geo.country');
}

/**
 * Return continent code based on cookie
 */
function getContinentCode(): string | undefined {
	return context.get('geo.continent');
}

/**
 * Return region code based on cookie
 */
function getRegionCode(): string | undefined {
	return context.get('geo.region');
}

/**
 * Checks whether current country (from cookie) is listed in array
 */
function isProperCountry(countryList: string[] = []): boolean {
	return !!(countryList && countryList.indexOf && countryList.indexOf(getCountryCode()) > -1);
}

/**
 * Checks whether current regions (from cookie) is listed in array
 */
function isProperRegion(countryList: string[] = []): boolean {
	const code = `${getCountryCode()}-${getRegionCode()}`;

	return !!(countryList && countryList.indexOf && countryList.indexOf(code) > -1);
}

function containsContinent(countryList: string[] = []): boolean {
	const geo = `${earth}-${getContinentCode()}`;

	return countryList.indexOf(geo) > -1;
}

/**
 * Checks whether current continent (from cookie) is listed in array
 */
function isProperContinent(countryList: string[] = []): boolean {
	return !!(
		countryList &&
		countryList.indexOf &&
		(containsEarth(countryList) || containsContinent(countryList))
	);
}

/**
 * Checks whether current geo (from cookie) is listed in array
 */
function isProperGeo(countryList: string[] = []): boolean {
	return !!(
		countryList &&
		countryList.indexOf &&
		(isProperContinent(countryList) || isProperCountry(countryList) || isProperRegion(countryList))
	);
}
