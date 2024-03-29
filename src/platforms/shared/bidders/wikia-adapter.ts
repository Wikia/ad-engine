import { utils } from '@wikia/ad-engine';

export function getWikiaContext(device: utils.DeviceMode): any {
	const context = {
		desktop: {
			enabled: false,
			slots: {
				'01_LB': {
					sizes: [[728, 90]],
				},
				'02_MR': {
					sizes: [[300, 250]],
				},
				'03_PF': {
					sizes: [[300, 250]],
				},
				'04_BLB': {
					sizes: [[728, 90]],
				},
				'06_FMR': {
					sizes: [[300, 250]],
				},
			},
		},
		mobile: {
			enabled: false,
			slots: {
				'01_LB': {
					sizes: [[320, 50]],
				},
				'02_MR': {
					sizes: [[300, 250]],
				},
				'03_PF': {
					sizes: [[300, 250]],
				},
				'04_BLB': {
					sizes: [[320, 50]],
				},
				'06_FMR': {
					sizes: [[300, 250]],
				},
			},
		},
	};

	return context[device];
}
