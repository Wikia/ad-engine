import { DeviceMode } from '../../models/device-mode';

export function getGamepediaNobidContext(device: DeviceMode): any {
	const context = {
		desktop: {
			enabled: false,
			slots: {
				'01_LB': {
					sizes: [
						[728, 90],
						[970, 250],
					],
					siteId: '21872987314',
				},
				'02_MR': {
					sizes: [
						[300, 250],
						[300, 600],
					],
					siteId: '21872987314',
				},
				'03_PF': {
					sizes: [[300, 250]],
					siteId: '21872987314',
				},
				'04_BLB': {
					sizes: [[728, 90]],
					siteId: '21872987314',
				},
				'06_FMR': {
					sizes: [[300, 250]],
					siteId: '21872987314',
				},
			},
		},

		mobile: {
			enabled: false,
			slots: {
				'01_LB': {
					sizes: [[320, 50]],
					siteId: '21872987314',
				},
				'02_MR': {
					sizes: [[300, 250]],
					siteId: '21872987314',
				},
				'03_PF': {
					sizes: [[300, 250]],
					siteId: '21872987314',
				},
			},
		},
	};

	return context[device];
}
