import { sessionCookie, utils } from '@wikia/ad-engine';

const preStatuses = document.getElementById('statuses');
const preGroups = document.getElementById('groups');
const instantGlobals = utils.queryString.getValues();
const sessionId = utils.queryString.get('sessionid');
const statuses = [];

sessionCookie.setSessionId(sessionId || 't3st4d3ng1n3s3ss1on1d');
utils.geoService.resetStorage();

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

preStatuses.innerText = statuses.join('\n');
preGroups.innerText = utils.geoService.getSamplingResults();
