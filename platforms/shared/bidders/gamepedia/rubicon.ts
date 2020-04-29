import { DeviceMode } from '../../models/device-mode';

export function getGamepediaRubiconContext(device: DeviceMode): any {
	const context = {
		desktop: {
			enabled: false,
			accountId: 7450,
			slots: {
				'01_LB': {
					sizes: [
						[728, 90],
						[970, 150],
						[970, 250],
					],
					targeting: {
						loc: ['top'],
					},
					position: 'atf',
					siteId: '260246',
					zoneId: '1289068',
				},
				'02_MR': {
					sizes: [
						[300, 250],
						[300, 600],
					],
					targeting: {
						loc: ['top'],
					},
					position: 'atf',
					siteId: '260246',
					zoneId: '1289070',
				},
				'03_PF': {
					sizes: [[300, 250]],
					targeting: {
						loc: ['middle'],
					},
					siteId: '260246',
					zoneId: '1289072',
				},
				'04_BLB': {
					sizes: [[728, 90]],
					targeting: {
						loc: ['footer'],
					},
					siteId: '260246',
					zoneId: '1289074',
				},
				'06_FMR': {
					sizes: [[300, 250]],
					targeting: {
						loc: ['hivi'],
					},
					siteId: '260246',
					zoneId: '1289076',
				},
			},
		},

		mobile: {
			enabled: false,
			accountId: 7450,
			slots: {
				'01_LB': {
					sizes: [[320, 50]],
					targeting: {
						loc: ['top'],
					},
					position: 'atf',
					siteId: '260250',
					zoneId: '1289080',
				},
				'02_MR': {
					sizes: [[300, 250]],
					targeting: {
						loc: ['top'],
					},
					position: 'atf',
					siteId: '260250',
					zoneId: '1289082',
				},
				'03_PF': {
					sizes: [[300, 250]],
					targeting: {
						loc: ['footer'],
					},
					siteId: '260250',
					zoneId: '1386698',
				},
				'06_FMR': {
					sizes: [[300, 250]],
					targeting: {
						loc: ['hivi'],
					},
					siteId: '260250',
					zoneId: '1289084',
				},
			},
		},
	};

	return context[device];
}
