import { DeviceMode } from '@platforms/shared';

export function getAppNexusContext(device: DeviceMode): any {
	const context = {
		desktop: {
			enabled: false,
			slots: {
				'01_LB': {
					sizes: [[728, 90], [970, 250]],
					placementId: '16755892',
				},
				'02_MR': {
					sizes: [[300, 250], [300, 600]],
					placementId: '16755893',
				},
				'03_PF': {
					sizes: [[300, 250]],
					placementId: '16755894',
				},
				'04_BLB': {
					sizes: [[728, 90]],
					placementId: '17372501',
				},
				'06_FMR': {
					sizes: [[300, 250]],
					placementId: '16755896',
				},
			},
		},

		mobile: {
			enabled: false,
			slots: {
				'01_LB': {
					sizes: [[320, 50]],
					placementId: '16755888',
				},
				'02_MR': {
					sizes: [[300, 250]],
					placementId: '16755889',
				},
				'03_PF': {
					sizes: [[300, 250]],
					placementId: '16755890',
				},
				'06_FMR': {
					sizes: [[300, 250]],
					placementId: '16755891',
				},
			},
		},
	};

	return context[device];
}
