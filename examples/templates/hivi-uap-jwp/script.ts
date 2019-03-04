import { AdEngine, btfBlockerService, context, templateService } from '@wikia/ad-engine';
import { BigFancyAdInPlayer } from '@wikia/ad-products';
import { DelayModule } from '@wikia/types';
import customContext from '../../context';
import '../../styles.scss';

let time = 10;

const clickDelay: DelayModule = {
	isEnabled: () => true,
	getName: () => 'click-to-load',
	getPromise: () =>
		new Promise((resolve) => {
			document.getElementById('clickDelay').addEventListener('click', () => {
				btfBlockerService.finishFirstCall();
				window.loadCustomAd({
					adProduct: 'jwp',
					type: 'bfp',
					uap: '4617193627',
				});
				resolve();
				time = 0;
			});
		}),
};
const interval = setInterval(() => {
	time -= 1;
	document.getElementById('clickDelay').innerText = 'Load UAP:JWP';
	if (time > 0) {
		document.getElementById('clickDelay').innerText += ` (${time}s)`;
	}
	if (time === 0) {
		clearInterval(interval);
	}
}, 1000);

customContext.targeting.artid = '496';
customContext.slots.incontent_boxad = {
	aboveTheFold: true,
	disable: false,
	slotName: 'incontent_boxad',
	sizes: [
		{
			viewportSize: [768, 0],
			sizes: [[300, 250], [300, 600]],
		},
	],
	defaultSizes: [[300, 250]],
	targeting: {
		loc: 'hivi',
	},
};
customContext.slots.bottom_leaderboard = {
	disable: false,
	slotName: 'bottom_leaderboard',
	sizes: [
		{
			viewportSize: [728, 0],
			sizes: [[3, 3]],
		},
	],
	defaultSizes: [[2, 2]],
	targeting: {
		loc: 'footer',
	},
};

context.extend(customContext);
context.set('options.maxDelayTimeout', 10000);
context.push('delayModules', clickDelay);

if (document.body.offsetWidth < 728) {
	context.set('state.isMobile', true);
	context.set('targeting.skin', 'fandom_mobile');
}

templateService.register(BigFancyAdInPlayer, {
	slotsToDisable: ['top_leaderboard', 'bottom_leaderboard'],
	slotsToEnable: ['top_boxad', 'incontent_boxad'],
});

new AdEngine().init();
