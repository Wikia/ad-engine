import { AdSlot } from './ad-slot';
import { commonAds } from '../pages/common-ad.page';

const slotsContext = {
	mobile: {
		bottomLeaderboard: {
			scrollTrigger: 'footer',
			slotName: 'bottom_leaderboard',
		},
		featured: {
			scrollTrigger: '.article-featured-video',
			slotName: 'featured',
		},
		floorAdhesion: {
			slotName: 'floor_adhesion',
		},
		incontentBoxad: {
			position: 'incontent_boxad',
			scrollTrigger: '.rail-module',
			slotName: 'incontent_boxad',
		},
		incontentPlayer: {
			slotName: 'incontent_player',
		},
		invisibleHighImpact2: {
			slotName: 'invisible_high_impact_2',
		},
		prefooter: {
			scrollTrigger: '.mobile-prefooter',
			slotName: 'mobile_prefooter',
		},
		topBoxad: {
			scrollTrigger: '.top-boxad',
			slotName: 'top_boxad',
		},
		topLeaderboard: {
			slotName: 'top_leaderboard',
		},
	},
	desktop: {
		bottomLeaderboard: {
			isLazyLoaded: true,
			scrollTrigger: 'footer',
			slotName: 'bottom_leaderboard',
		},
		incontentBoxad: {
			scrollTrigger: commonAds.railModule,
			slotName: 'incontent_boxad',
		},
		injectedBoxad: {
			scrollTrigger: commonAds.railModule,
			slotName: 'injected_boxad',
		},
		incontentPlayer: {
			isLazyLoaded: true,
			slotName: 'incontent_player',
		},
		invisibleHighImpact: {
			slotName: 'invisible_high_impact_2',
		},
		topBoxad: {
			slotName: 'top_boxad',
		},
		topLeaderboard: {
			slotName: 'top_leaderboard',
		},
		floorAdhesion: {
			slotName: 'floor_adhesion',
		},
		repeatableBoxad1: {
			scrollTrigger: commonAds.railModule,
			slotName: 'repeatable_boxad_1',
		},
		repeatableBoxad2: {
			slotName: 'repeatable_boxad_2',
		},
		repeatableBoxad3: {
			slotName: 'repeatable_boxad_3',
		},
		repeatableBoxad4: {
			slotName: 'repeatable_boxad_4',
		},
		repeatableBoxad5: {
			slotName: 'repeatable_boxad_5',
		},
		repeatableBoxad6: {
			slotName: 'repeatable_boxad_6',
		},
		repeatableBoxad7: {
			slotName: 'repeatable_boxad_7',
		},
		repeatableBoxad8: {
			slotName: 'repeatable_boxad_8',
		},
		repeatableBoxad9: {
			slotName: 'repeatable_boxad_9',
		},
		repeatableBoxad10: {
			slotName: 'repeatable_boxad_10',
		},
	},
};

const slotMap = {};

Object.keys(slotsContext[platform]).forEach((index) => {
	const config = slotsContext[platform][index];

	slotMap[index] = new AdSlot(config);
});

export const slots = slotMap;
