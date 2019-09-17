import { DeviceMode } from '@platforms/shared';

export function getAppNexusContext(device: DeviceMode): any {
	const context = {
		desktop: {
			enabled: false,
			slots: {
				'01_LB': {
					sizes: [[728, 90], [970, 250]],
					placementId: '16755870',
				},
				'02_MR': {
					sizes: [[300, 250], [300, 600]],
					placementId: '16755872',
				},
				'03_PF': {
					sizes: [[300, 250]],
					placementId: '16755874',
				},
				'04_BLB': {
					sizes: [[728, 90]],
					placementId: '16755876',
				},
				'06_FMR': {
					sizes: [[300, 250]],
					placementId: '16755879',
				},
			},
		},

		mobile: {
			enabled: false,
			slots: {
				'01_LB': {
					sizes: [[320, 50]],
					placementId: '16755858',
				},
				'02_MR': {
					sizes: [[300, 250]],
					placementId: '16755860',
				},
				'03_PF': {
					sizes: [[300, 250]],
					placementId: '16755861',
				},
				'06_FMR': {
					sizes: [[300, 250]],
					placementId: '16755866',
				},
			},
		},
	};

	return context[device];
}
