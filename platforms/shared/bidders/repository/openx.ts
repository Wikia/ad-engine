import { DeviceMode } from '../../models/device-mode';

export function getOpenXContext(device: DeviceMode): any {
	const context = {
		desktop: {
			enabled: false,
			delDomain: 'wikia-d.openx.net',
			slots: {
				'01_LB': {
					sizes: [[728, 90], [970, 150], [970, 250]],
					unit: '540774852',
				},
				'02_MR': {
					sizes: [[300, 250], [300, 600]],
					unit: '540774853',
				},
				'03_PF': {
					sizes: [[300, 250]],
					unit: '540774856',
				},
				'04_BLB': {
					sizes: [[728, 90]],
					unit: '540774855',
				},
				'06_FMR': {
					sizes: [[300, 250]],
					unit: '540774854',
				},
			},
		},

		mobile: {
			enabled: false,
			delDomain: 'wikia-d.openx.net',
			slots: {
				'01_LB': {
					sizes: [[320, 50]],
					unit: '540774857',
				},
				'02_MR': {
					sizes: [[300, 250]],
					unit: '540774858',
				},
				'03_PF': {
					sizes: [[300, 250]],
					unit: '540820350',
				},
				'06_FMR': {
					sizes: [[300, 250]],
					unit: '540774859',
				},
			},
		},
	};

	return context[device];
}
