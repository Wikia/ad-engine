import { AdSlot } from './ad-slot';

const slotsContext = {
	mobile: {
		bottomLeaderboard: {
			scrollTrigger: '.bottom-leaderboard',
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
			scrollTrigger: '.incontent-boxad,.incontent-boxad-1',
			slotName: 'incontent_boxad_1',
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
			slotName: 'bottom_leaderboard',
		},
		featured: {
			scrollTrigger: '.featured-video',
			slotName: 'featured',
		},
		floorAdhesion: {
			slotName: 'floor_adhesion',
		},
		adSkin: {
			slotName: 'ad-skin',
		},
		hiviLeaderboard: {
			slotName: 'hivi_leaderboard',
		},
		incontentBoxad: {
			scrollTrigger: '#WikiaAdInContentPlaceHolder',
			slotName: 'incontent_boxad_1',
		},
		incontentPlayer: {
			isLazyLoaded: true,
			slotName: 'incontent_player',
		},
		invisibleHighImpact2: {
			slotName: 'invisible_high_impact_2',
		},
		invisibleSkin: {
			slotName: 'invisible_skin',
		},
		topBoxad: {
			slotName: 'top_boxad',
		},
		topLeaderboard: {
			slotName: 'top_leaderboard',
		},
	},
};

const slotMap = {};

Object.keys(slotsContext[platform]).forEach((index) => {
	const config = slotsContext[platform][index];

	slotMap[index] = new AdSlot(config);
});

export const slots = slotMap;
