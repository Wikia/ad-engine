import { AdEngine, context, moatYi, utils } from '@wikia/ad-engine';
import adContext from '../../context';

const isMoatEnabled = utils.queryString.get('moat-yi-disabled') !== '1';
const delay = parseInt(utils.queryString.get('adengine-delay') || '1000', 10);

context.extend(adContext);
context.set('services.moatYi.enabled', isMoatEnabled);

moatYi.call().then(() => {
	document.getElementById('pageParams').innerText = JSON.stringify(
		window.moatPrebidApi.getMoatTargetingForPage(),
	);
});

setTimeout(() => {
	new AdEngine().init();
}, delay);
