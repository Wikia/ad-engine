import { context } from '@wikia/ad-engine';
import { basicContext } from './ad-context';
import { cmpWrapper } from './cmp/cmp-wrapper';
import { setupAdEngine } from './setup-ad-engine';
import './styles.scss';

// RLQ may not exist as AdEngine is loading independently from Resource Loader
window.RLQ = window.RLQ || [];
window.RLQ.push(() => {
	// AdEngine has to wait for Track extension
	window.mw.loader.using('ext.track.scripts').then(() => {
		cmpWrapper.getGeo().then((geo) => {
			context.extend(basicContext);

			context.set('custom.isCMPEnabled', cmpWrapper.geoRequiresConsent(geo));
			context.set('targeting.geo', geo.toUpperCase());

			cmpWrapper.init().then(() => {
				cmpWrapper.getConsent(geo).then((response) => setupAdEngine(response));
			});
		});
	});
});
