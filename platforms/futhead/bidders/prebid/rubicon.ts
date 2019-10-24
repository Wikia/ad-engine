import { DeviceMode } from '@platforms/shared';

export function getRubiconContext(device: DeviceMode): any {
	const context = {
		desktop: {
			enabled: false,
			accountId: 7450,
			slots: {
				'01_LB': {
					sizes: [[728, 90], [970, 250]],
					targeting: {
						loc: ['top'],
					},
					position: 'atf',
					siteId: '280252',
					zoneId: '1398296',
				},
				'02_MR': {
					sizes: [[300, 250], [300, 600]],
					targeting: {
						loc: ['top'],
					},
					position: 'atf',
					siteId: '280252',
					zoneId: '1398298',
				},
				'03_PF': {
					sizes: [[300, 250]],
					targeting: {
						loc: ['middle'],
					},
					siteId: '280252',
					zoneId: '1398300',
				},
				'04_BLB': {
					sizes: [[728, 90]],
					targeting: {
						loc: ['footer'],
					},
					siteId: '280252',
					zoneId: '1454110',
				},
				'06_FMR': {
					sizes: [[300, 250]],
					targeting: {
						loc: ['hivi'],
					},
					siteId: '280252',
					zoneId: '1398302',
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
					siteId: '280254',
					zoneId: '1398304',
				},
				'02_MR': {
					sizes: [[300, 250]],
					targeting: {
						loc: ['top'],
					},
					position: 'atf',
					siteId: '280254',
					zoneId: '1398306',
				},
				'03_PF': {
					sizes: [[300, 250]],
					targeting: {
						loc: ['footer'],
					},
					siteId: '280254',
					zoneId: '1398308',
				},
				'06_FMR': {
					sizes: [[300, 250]],
					targeting: {
						loc: ['hivi'],
					},
					siteId: '280254',
					zoneId: '1398310',
				},
			},
		},
	};

	return context[device];
}
