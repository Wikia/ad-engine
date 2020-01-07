import { DeviceMode } from '@platforms/shared';

export function getCriteoContext(device: DeviceMode): any {
	const context = {
		desktop: {
			enabled: false,
			slots: {
				'01_LB': {
					sizes: [[728, 90], [970, 250]],
					networkId: '3306',
				},
				'02_MR': {
					sizes: [[300, 250], [300, 600]],
					networkId: '3306',
				},
				'03_PF': {
					sizes: [[300, 250]],
					networkId: '3306',
				},
				'04_BLB': {
					sizes: [[728, 90]],
					networkId: '3306',
				},
				'06_FMR': {
					sizes: [[300, 250]],
					networkId: '3306',
				},
			},
		},

		mobile: {
			enabled: false,
			slots: {
				'01_LB': {
					sizes: [[320, 50]],
					networkId: '3306',
				},
				'02_MR': {
					sizes: [[300, 250]],
					networkId: '3306',
				},
				'06_FMR': {
					sizes: [[300, 250]],
					networkId: '3306',
				},
			},
		},
	};

	return context[device];
}
