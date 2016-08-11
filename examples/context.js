'use strict';

import Context from 'ad-engine/services/context-service';

Context.extend({
	adUnitId: '/5441/wka.life/_project43//article/gpt/{slotName}',
	events: {
		pushOnScroll: {
			ids: [
				'gpt-incontent-boxad'
			],
			threshold: 100
		}
	},
	slots: {
		'top-leaderboard': {
			slotName: 'TOP_LEADERBOARD',
			aboveTheFold: true,
			sizes: [
				{
					viewportSize: [728, 0],
					sizes: [[728, 90]]
				}
			],
			defaultSizes: [[300, 250]],
			targeting: {
				loc: 'top'
			}
		},
		'top-boxad': {
			slotName: 'TOP_BOXAD',
			aboveTheFold: true,
			sizes: [
				{
					viewportSize: [768, 0],
					sizes: [[300, 250], [300, 600]]
				}
			],
			defaultSizes: [[300, 250]],
			targeting: {
				loc: 'top'
			}
		},
		'incontent-boxad': {
			slotName: 'INCONTENT_BOXAD',
			sizes: [
				{
					viewportSize: [768, 0],
					sizes: [[300, 250], [300, 600]]
				}
			],
			defaultSizes: [[300, 250]],
			defaultTemplate: 'floating-ad',
			targeting: {
				loc: 'hivi'
			}
		},
		'high-impact': {
			slotName: 'INVISIBLE_HIGH_IMPACT_2',
			sizes:  [
				{
					viewportSize: [768, 0],
					sizes: [[1, 1]]
				}
			],
			defaultTemplate: 'interstitial',
			targeting: {
				loc: 'hivi'
			},
			outOfPage: true
		}
	},
	state: {
		isMobile: false
	}
});

export default Context;
