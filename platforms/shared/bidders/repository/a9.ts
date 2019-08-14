import { DeviceMode } from '../../models/device-mode';

export function getA9Context(device: DeviceMode): any {
	const context = {
		desktop: {
			'01_LB': {
				sizes: [[728, 90], [970, 150], [970, 250]],
			},
			'02_MR': {
				sizes: [[300, 250], [300, 600]],
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

		mobile: {
			'01_LB': {
				sizes: [[320, 50]],
			},
			'02_MR': {
				sizes: [[300, 250]],
			},
			'06_FMR': {
				sizes: [[300, 250]],
			},
		},
	};

	return context[device];
}
