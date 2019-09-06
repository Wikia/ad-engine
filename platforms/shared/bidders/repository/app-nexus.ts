import { DeviceMode } from '../../models/device-mode';

export function getAppNexusContext(device: DeviceMode): any {
	const context = {
		desktop: {
			enabled: false,
			slots: {
				'01_LB': {
					sizes: [[728, 90], [970, 150], [970, 250]],
					placementId: '15976818',
				},
				'02_MR': {
					sizes: [[300, 250], [300, 600]],
					placementId: '15976819',
				},
				'03_PF': {
					sizes: [[300, 250]],
					placementId: '15976832',
				},
				'04_BLB': {
					sizes: [[728, 90]],
					placementId: '15976830',
				},
				'06_FMR': {
					sizes: [[300, 250]],
					placementId: '15976820',
				},
			},
		},

		mobile: {
			enabled: false,
			slots: {
				'01_LB': {
					sizes: [[320, 50]],
					placementId: '15976871',
				},
				'02_MR': {
					sizes: [[300, 250]],
					placementId: '15976892',
				},
				'03_PF': {
					sizes: [[300, 250]],
					placementId: '16666469',
				},
				'06_FMR': {
					sizes: [[300, 250]],
					placementId: '15976893',
				},
			},
		},
	};

	return context[device];
}
