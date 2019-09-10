import * as Cookies from 'js-cookie';
import { context } from '../services/context-service';
import { CacheData, InstantConfigCacheStorage } from '../services/instant-config-cache-storage';

const cacheMarker = '-cached';
const earth = 'XX';
const negativePrefix = 'non-';
// precision to 0.00000001 (or 0.000001%) of traffic
const precision = 10 ** 6;
const samplingSeparator = '/';

export interface GeoData {
	region?: string;
	country?: string;
	continent?: string;
}

function setUpGeoData(): GeoData {
	const jsonData = decodeURIComponent(Cookies.get('Geo'));

	try {
		const geoData: GeoData = JSON.parse(jsonData) || {};
		context.set('geo.region', geoData.region);
		context.set('geo.country', geoData.country);
		context.set('geo.continent', geoData.continent);
	} catch (e) {}

	return context.get('geo');
}

function hasCache(countryList: string[]): boolean {
	return countryList.some((country) => country.indexOf(cacheMarker) !== -1);
}

function hasSampling(geo: string): (value: string) => boolean {
	return (value: string) =>
		value.indexOf(negativePrefix) !== 0 && value.indexOf(geo + samplingSeparator) > -1;
}

function getSamplingLimits(value: string): number {
	let [, samplingValue]: string[] = value.split(samplingSeparator);

	samplingValue = samplingValue.replace(cacheMarker, '');

	return Math.round(parseFloat(samplingValue) * precision) | 0;
}

function addResultToCache(
	name: string,
	result: boolean,
	samplingLimits: number[],
	withCookie: boolean,
): void {
	const cacheStorage = InstantConfigCacheStorage.make();
	const [limitValue]: number[] = samplingLimits;
	const data: CacheData = {
		name,
		result,
		withCookie,
		group: result ? 'B' : 'A',
		limit: (result ? limitValue : precision * 100 - limitValue) / precision,
	};

	cacheStorage.set(data);
}

function getResult(samplingLimits: number[], name: string, withCookie: boolean): boolean {
	const randomValue: number = Math.round(Math.random() * (precision * 100)) | 0;
	const result: boolean = samplingLimits.some((value) => randomValue < value);

	if (name) {
		addResultToCache(name, result, samplingLimits, withCookie);
	}

	return result;
}

function isSampledForGeo(countryList: string[], geo: string, name: string): boolean {
	const countryListWithSampling: string[] = countryList.filter(hasSampling(geo));
	const cachedWithCookie: boolean = hasCache(countryList);

	if (countryListWithSampling.length === 0) {
		return false;
	}

	return getResult(countryListWithSampling.map(getSamplingLimits), name, cachedWithCookie);
}

function containsEarth(countryList: string[], name: string): boolean {
	return countryList.indexOf(earth) > -1 || isSampledForGeo(countryList, earth, name);
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
function isProperCountry(countryList: string[] = [], name?: string): boolean {
	return !!(
		countryList &&
		countryList.indexOf &&
		(countryList.indexOf(geoService.getCountryCode()) > -1 ||
			isSampledForGeo(countryList, geoService.getCountryCode(), name))
	);
}

/**
 * Checks whether current regions (from cookie) is listed in array
 */
function isProperRegion(countryList: string[] = [], name?: string): boolean {
	const code = `${geoService.getCountryCode()}-${geoService.getRegionCode()}`;

	return !!(
		countryList &&
		countryList.indexOf &&
		(countryList.indexOf(code) > -1 || isSampledForGeo(countryList, code, name))
	);
}

function containsContinent(countryList: string[] = [], name?: string): boolean {
	const geo = `${earth}-${geoService.getContinentCode()}`;

	return countryList.indexOf(geo) > -1 || isSampledForGeo(countryList, geo, name);
}

/**
 * Checks whether current continent (from cookie) is listed in array
 */
function isProperContinent(countryList: string[] = [], name?: string): boolean {
	return !!(
		countryList &&
		countryList.indexOf &&
		(containsEarth(countryList, name) || containsContinent(countryList, name))
	);
}

/**
 * Checks whether current geo is excluded in array (by using non- prefix)
 */
function isGeoExcluded(countryList: string[] = []): boolean {
	return !!(
		countryList.indexOf(`${negativePrefix}${geoService.getCountryCode()}`) > -1 ||
		countryList.indexOf(
			`${negativePrefix}${geoService.getCountryCode()}-${geoService.getRegionCode()}`,
		) > -1 ||
		countryList.indexOf(`${negativePrefix}${earth}-${geoService.getContinentCode()}`) > -1
	);
}

/**
 * Checks whether current geo (from cookie) is listed in array and it's not excluded
 */
function isProperGeo(countryList: string[] = [], name?: string): boolean {
	const cacheStorage = InstantConfigCacheStorage.make();

	if (name !== undefined && typeof cacheStorage.get(name) !== 'undefined') {
		return cacheStorage.get(name).result;
	}

	return !!(
		countryList &&
		countryList.indexOf &&
		!isGeoExcluded(countryList) &&
		(geoService.isProperContinent(countryList, name) ||
			geoService.isProperCountry(countryList, name) ||
			geoService.isProperRegion(countryList, name))
	);
}

export const geoService = {
	setUpGeoData,
	isProperContinent,
	isProperCountry,
	isProperRegion,
	getContinentCode,
	getCountryCode,
	getRegionCode,
	isProperGeo,
};
