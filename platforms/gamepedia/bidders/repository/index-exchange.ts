import { DeviceMode } from '../../models/device-mode';

export function getIndexExchangeContext(device: DeviceMode): any {
	const context = {
		desktop: {
			enabled: false,
			slots: {
				'01_LB': {
					sizes: [[728, 90], [970, 150], [970, 250]],
					siteId: '367523',
				},
				'02_MR': {
					sizes: [[300, 250], [300, 600]],
					siteId: '367524',
				},
				'03_PF': {
					sizes: [[300, 250]],
					siteId: '367527',
				},
				'04_BLB': {
					sizes: [[728, 90]],
					siteId: '367526',
				},
				'06_FMR': {
					sizes: [[300, 250]],
					siteId: '367525',
				},
			},
		},

		mobile: {
			enabled: false,
			slots: {
				'01_LB': {
					sizes: [[320, 50]],
					siteId: '367528',
				},
				'02_MR': {
					sizes: [[300, 250]],
					siteId: '367529',
				},
				'06_FMR': {
					sizes: [[300, 250]],
					siteId: '367530',
				},
			},
		},
	};

	return context[device];
}
