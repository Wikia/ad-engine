export function getRubiconDisplayContext(): object {
	return {
		enabled: false,
		accountId: '12556', // it's different in https://github.com/Wikia/player1-ads-adlibrary/blob/REVSYS-1890_MoarPurge/configs/gamefaqs-rv/config.js#L36-L37
		slots: {
			leader_plus_top: {
				sizes: [[728, 90]],
				siteId: '110932',
				zoneId: '2095012',
			},
		},
	};
}
