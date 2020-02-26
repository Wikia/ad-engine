import { AdEngine, context, utils } from '@wikia/ad-engine';
import adContext from '../../context';

let time = 10;

const clickInhibitor = utils.createExtendedPromise();
const interval = setInterval(() => {
	time -= 1;
	document.getElementById('clickDelay').innerText = 'Load ads';
	if (time > 0) {
		document.getElementById('clickDelay').innerText += ` (${time}s)`;
	}
	if (time === 0) {
		clearInterval(interval);
	}
}, 1000);

document.getElementById('clickDelay').addEventListener('click', () => {
	clickInhibitor.resolve();
	time = 0;
});

context.extend(adContext);
context.set('options.maxDelayTimeout', 10000);

new AdEngine().init([clickInhibitor]);
