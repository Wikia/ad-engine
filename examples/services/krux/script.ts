import { AdEngine, context, krux, utils } from '@wikia/ad-engine';
import adContext from '../../context';

const isKruxEnabled = utils.queryString.get('krux-disabled') !== '1';
const isOptedIn = utils.queryString.get('tracking-opt-in') !== '0';

context.extend(adContext);
context.set('services.krux.enabled', isKruxEnabled);
context.set('services.krux.account', 'ns:wikia');
context.set('options.trackingOptIn', isOptedIn);

krux.call().then(() => {
	document.getElementById('user').innerText = krux.getUserId();
	document.getElementById('segments').innerText = krux.getSegments().join('\n');
});

document.getElementById('fireEvent').addEventListener('click', () => {
	krux.fireEvent('M-FnMTsI');
});

setTimeout(() => {
	new AdEngine().init();
}, 1000);
