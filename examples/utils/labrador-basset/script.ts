import { InstantConfigCacheStorage, SessionCookie, utils } from '@wikia/ad-engine';

const preGeo = document.getElementById('geo');
const preStatuses = document.getElementById('statuses');
const preGroups = document.getElementById('groups');

const btnSetGeoCookie = document.getElementById('setGeoCookie');
const btnClearGeoCookie = document.getElementById('clearGeoCookie');

const instantGlobals = utils.queryString.getValues();
const sessionId = utils.queryString.get('sessionid');
const statuses = [];
const cacheStorage = InstantConfigCacheStorage.make();
const sessionCookie = SessionCookie.make();

utils.geoService.setUpGeoData();
sessionCookie.setSessionId(sessionId || 't3st4d3ng1n3s3ss1on1d');
cacheStorage.resetCache();

Object.keys(instantGlobals).forEach((variable) => {
	if (variable.substr(0, 14) === 'InstantGlobals') {
		const name = variable.replace('InstantGlobals.', '');
		const value = instantGlobals[variable]
			.replace('[', '')
			.replace(']', '')
			.split(',');

		statuses.push(`${name}: ${utils.geoService.isProperGeo(value, name) ? 'enabled' : 'disabled'}`);
	}
});

preGeo.innerText = utils.geoService.getCountryCode();
preStatuses.innerText = statuses.join('\n');
preGroups.innerText = cacheStorage.getSamplingResults().join(',');

btnSetGeoCookie.addEventListener('click', () => {
	document.cookie =
		'Geo={%22region%22:%2230%22%2C%22country%22:%22PL%22%2C%22continent%22:%22EU%22}';
	document.location.reload();
});

btnClearGeoCookie.addEventListener('click', () => {
	document.cookie = 'Geo=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
	document.location.reload();
});
