export const gamefaqsConfig = {
	targeting: {
		seats: {
			session: 16,
			subsession: 4,
		},
		cookie: {
			consolidate: true, // comes as true from the backend: https://github.com/Wikia/phoenix/blob/master/SiteBundle/Resources/js/src/ads/bidbarrel/adManager.js#L888
			keyMap: {
				ftag: 'ftag',
				ttag: 'ttag',
			},
		},
	},
	timeouts: {
		bidder: 1000,
	},
};
