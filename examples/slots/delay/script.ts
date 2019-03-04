import { AdEngine, context, DelayModule } from '@wikia/ad-engine';
import adContext from '../../context';

let time = 10;

const clickDelay: DelayModule = {
	isEnabled: () => true,
	getName: () => 'click-to-load',
	getPromise: () =>
		new Promise((resolve) => {
			document.getElementById('clickDelay').addEventListener('click', () => {
				resolve();
				time = 0;
			});
		}),
};
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

context.extend(adContext);
context.set('options.maxDelayTimeout', 10000);
context.push('delayModules', clickDelay);

new AdEngine().init();
