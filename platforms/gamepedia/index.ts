import { context, utils } from '@wikia/ad-engine';
import { basicContext } from './ad-context';
import { cmpWrapper } from './cmp/cmp-wrapper';
import { setupAdEngine } from './setup-ad-engine';
import './styles.scss';
import { targeting } from './targeting';

// RLQ may not exist as AdEngine is loading independently from Resource Loader
window.RLQ = window.RLQ || [];
window.RLQ.push(() => {
	// AdEngine has to wait for Track extension
	window.mw.loader.using('ext.track.scripts').then(() => {
		let geo = 'PL'; // Staging and devboxes don't go through Fastly

		if (targeting.getDomain() === 'gamepediacom') {
			geo = utils.geoService.setUpGeoData().country;
		}

		context.extend(basicContext);

		context.set('custom.isCMPEnabled', cmpWrapper.geoRequiresConsent(geo));
		context.set('options.geoRequiresConsent', cmpWrapper.geoRequiresConsent(geo));

		cmpWrapper.init().then(() => {
			cmpWrapper.getConsent(geo).then((response) => setupAdEngine(response));
		});
	});
});
