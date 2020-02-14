import { DeviceMode } from '@platforms/shared';

export function getNobidContext(device: DeviceMode): any {
	const context = {
		desktop: {
			enabled: false,
			slots: {
				'01_LB': {
					sizes: [[728, 90], [970, 250]],
					siteId: '21874833448',
				},
				'02_MR': {
					sizes: [[300, 250], [300, 600]],
					siteId: '21874833448',
				},
				'03_PF': {
					sizes: [[300, 250]],
					siteId: '21874833448',
				},
				'04_BLB': {
					sizes: [[728, 90]],
					siteId: '21874833448',
				},
				'06_FMR': {
					sizes: [[300, 250]],
					siteId: '21874833448',
				},
			},
		},

		mobile: {
			enabled: false,
			slots: {
				'01_LB': {
					sizes: [[320, 50]],
					siteId: '21874833448',
				},
				'02_MR': {
					sizes: [[300, 250]],
					siteId: '21874833448',
				},
				'03_PF': {
					sizes: [[300, 250]],
					siteId: '21874833448',
				},
				'06_FMR': {
					sizes: [[300, 250]],
					siteId: '21874833448',
				},
			},
		},
	};

	return context[device];
}
