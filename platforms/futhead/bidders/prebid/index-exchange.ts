import { DeviceMode } from '@platforms/shared';

export function getIndexExchangeContext(device: DeviceMode): any {
	const context = {
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
	};

	return context[device];
}
