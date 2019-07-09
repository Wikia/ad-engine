import * as Cookies from 'js-cookie';
import { context } from '../services/context-service';

const cacheMarker = '-cached';
const cacheMaxAge = 30 * 60 * 1000;
const earth = 'XX';
const negativePrefix = 'non-';
// precision to 0.00000001 (or 0.000001%) of traffic
const precision = 10 ** 6;
const samplingSeparator = '/';
const sessionCookieDefault = 'tracking_session_id';
let cache: CacheDictionary = {};
let cookieLoaded = false;
const geoData: GeoData | {} = null;

export interface CacheDictionary {
	[key: string]: CacheData;
}

export interface CacheData {
	name: string;
	group: 'A' | 'B';
	limit: number;
	result: boolean;
	withCookie: boolean;
}

export interface GeoData {
	region: string;
	country: string;
	continent: string;
}

// TODO: Check if they are necessary
export interface WikiaCookieAttributes extends Cookies.CookieAttributes {
	overwrite: boolean;
	maxAge: number;
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
	const [limitValue]: number[] = samplingLimits;

	cache[name] = {
		name,
		result,
		withCookie,
		group: result ? 'B' : 'A',
		limit: (result ? limitValue : precision * 100 - limitValue) / precision,
	};

	if (withCookie) {
		synchronizeCookie();
	}
}

function getCookieDomain(): string | undefined {
	const domain: string[] = window.location.hostname.split('.');

	return domain.length > 1
		? `.${domain[domain.length - 2]}.${domain[domain.length - 1]}`
		: undefined;
}

function loadCookie(): void {
	geoService.readSessionId();

	const cookie: string = Cookies.get(`${context.get('options.session.id')}_basset`);

	if (cookie) {
		const cachedVariables: CacheDictionary = JSON.parse(cookie);

		Object.keys(cachedVariables).forEach((variable) => {
			cache[variable] = cachedVariables[variable];
		});

		setCookie(cookie);
	}

	cookieLoaded = true;
}

function synchronizeCookie(): void {
	const cachedVariables: CacheDictionary = {};

	Object.keys(cache).forEach((variable) => {
		if (cache[variable].withCookie) {
			cachedVariables[variable] = cache[variable];
		}
	});

	setCookie(JSON.stringify(cachedVariables));
}

function setCookie(value: any): void {
	const cookieAttributes: WikiaCookieAttributes = {
		expires: new Date(new Date().getTime() + cacheMaxAge),
		path: '/',
		domain: getCookieDomain(),
		overwrite: true,
		maxAge: cacheMaxAge,
	};

	Cookies.set(`${context.get('options.session.id')}_basset`, value, cookieAttributes);
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

function getResultLog(name: string): string {
	const entry: CacheData = cache[name];

	return `${entry.name}_${entry.group}_${entry.limit}`;
}

function resetSamplingCache(): void {
	cache = {};
}

function readSessionId(): void {
	const sessionCookieName: string =
		context.get('options.session.cookieName') || sessionCookieDefault;
	const sid: string = Cookies.get(sessionCookieName) || context.get('options.session.id') || 'ae3';

	geoService.setSessionId(sid);
}

function setSessionId(sid: string): void {
	context.set('options.session.id', sid);
	cookieLoaded = false;
}

function getSamplingResults(): string[] {
	return Object.keys(cache).map(getResultLog);
}

/**
 * Checks whether current geo (from cookie) is listed in array and it's not excluded
 */
function isProperGeo(countryList: string[] = [], name?: string): boolean {
	if (!cookieLoaded) {
		loadCookie();
	}

	if (name !== undefined && typeof cache[name] !== 'undefined') {
		return cache[name].result;
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

/**
 * Transform sampling results using supplied key-values map.
 */
function mapSamplingResults(keyVals: string[] = []): string[] {
	if (!keyVals || !keyVals.length) {
		return [];
	}

	const labradorVariables: string[] = geoService.getSamplingResults();

	return keyVals
		.map((keyVal: string) => keyVal.split(':'))
		.filter(([lineId]: string[]) => labradorVariables.indexOf(lineId) !== -1)
		.map(([lineId, geo]: string[]) => geo);
}

export const geoService = {
	isProperContinent,
	isProperCountry,
	isProperRegion,
	getContinentCode,
	getCountryCode,
	getRegionCode,
	getSamplingResults,
	isProperGeo,
	resetSamplingCache,
	readSessionId,
	setSessionId,
	mapSamplingResults,
};
