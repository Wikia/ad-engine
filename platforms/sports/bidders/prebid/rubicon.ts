import { DeviceMode } from '@platforms/shared';

export function getRubiconContext(app: string, device: DeviceMode): any {
	const context = {
		muthead: {
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
						siteId: '280244',
						zoneId: '1398244',
					},
					'02_MR': {
						sizes: [[300, 250], [300, 600]],
						targeting: {
							loc: ['top'],
						},
						position: 'atf',
						siteId: '280244',
						zoneId: '1398246',
					},
					'03_PF': {
						sizes: [[300, 250]],
						targeting: {
							loc: ['middle'],
						},
						siteId: '280244',
						zoneId: '1398248',
					},
					'04_BLB': {
						sizes: [[728, 90]],
						targeting: {
							loc: ['footer'],
						},
						siteId: '280244',
						zoneId: '1398250',
					},
					'06_FMR': {
						sizes: [[300, 250]],
						targeting: {
							loc: ['hivi'],
						},
						siteId: '280244',
						zoneId: '1398254',
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
						siteId: '280246',
						zoneId: '1398256',
					},
					'02_MR': {
						sizes: [[300, 250]],
						targeting: {
							loc: ['top'],
						},
						position: 'atf',
						siteId: '280246',
						zoneId: '1398258',
					},
					'03_PF': {
						sizes: [[300, 250]],
						targeting: {
							loc: ['footer'],
						},
						siteId: '280246',
						zoneId: '1398260',
					},
					'06_FMR': {
						sizes: [[300, 250]],
						targeting: {
							loc: ['hivi'],
						},
						siteId: '280246',
						zoneId: '1398264',
					},
				},
			},
		},
	};

	return context[app][device];
}
