import { DeviceMode } from '@platforms/shared';

export function getNobidContext(device: DeviceMode): any {
	const context = {
		desktop: {
			enabled: false,
			slots: {
				'01_LB': {
					sizes: [[728, 90], [970, 250]],
					siteId: '21874833814',
				},
				'02_MR': {
					sizes: [[300, 250], [300, 600]],
					siteId: '21874833814',
				},
				'03_PF': {
					sizes: [[300, 250]],
					siteId: '21874833814',
				},
				'04_BLB': {
					sizes: [[728, 90]],
					siteId: '21874833814',
				},
				'06_FMR': {
					sizes: [[300, 250]],
					siteId: '21874833814',
				},
			},
		},

		mobile: {
			enabled: false,
			slots: {
				'01_LB': {
					sizes: [[320, 50]],
					siteId: '21874833814',
				},
				'02_MR': {
					sizes: [[300, 250]],
					siteId: '21874833814',
				},
				'03_PF': {
					sizes: [[300, 250]],
					siteId: '21874833814',
				},
				'06_FMR': {
					sizes: [[300, 250]],
					siteId: '21874833814',
				},
			},
		},
	};

	return context[device];
}
