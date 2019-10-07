import { DeviceMode } from '@platforms/shared';

export function getIndexExchangeContext(app: string, device: DeviceMode): any {
	const context = {
		muthead: {
			desktop: {
				enabled: false,
				slots: {
					'01_LB': {
						sizes: [[728, 90], [970, 250]],
						siteId: '410295',
					},
					'02_MR': {
						sizes: [[300, 250], [300, 600]],
						siteId: '410297',
					},
					'03_PF': {
						sizes: [[300, 250]],
						siteId: '410299',
					},
					'04_BLB': {
						sizes: [[728, 90]],
						siteId: '410300',
					},
					'06_FMR': {
						sizes: [[300, 250]],
						siteId: '410305',
					},
				},
			},

			mobile: {
				enabled: false,
				slots: {
					'01_LB': {
						sizes: [[320, 50]],
						siteId: '410286',
					},
					'02_MR': {
						sizes: [[300, 250]],
						siteId: '410287',
					},
					'03_PF': {
						sizes: [[300, 250]],
						siteId: '410288',
					},
					'06_FMR': {
						sizes: [[300, 250]],
						siteId: '410290',
					},
				},
			},
		},

		futhead: {
			desktop: {
				enabled: false,
				slots: {
					'01_LB': {
						sizes: [[728, 90], [970, 250]],
						siteId: '410298',
					},
					'02_MR': {
						sizes: [[300, 250], [300, 600]],
						siteId: '410301',
					},
					'03_PF': {
						sizes: [[300, 250]],
						siteId: '410303',
					},
					'06_FMR': {
						sizes: [[300, 250]],
						siteId: '410304',
					},
				},
			},

			mobile: {
				enabled: false,
				slots: {
					'01_LB': {
						sizes: [[320, 50]],
						siteId: '410291',
					},
					'02_MR': {
						sizes: [[300, 250]],
						siteId: '410293',
					},
					'03_PF': {
						sizes: [[300, 250]],
						siteId: '410294',
					},
					'06_FMR': {
						sizes: [[300, 250]],
						siteId: '410296',
					},
				},
			},
		},
	};

	return context[app][device];
}
