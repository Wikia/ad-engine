import { DeviceMode, getDeviceMode } from '@platforms/shared';
import { context } from '@wikia/ad-engine';

export function setA9AdapterConfig(): void {
	const mode: DeviceMode = getDeviceMode();

	context.set('bidders.a9.slots', getA9Context(mode));
}

function getA9Context(device: DeviceMode): any {
	const a9Context = {
		desktop: {
			'01_LB': {
				sizes: [[728, 90], [970, 250]],
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
			'03_PF': {
				sizes: [[300, 250]],
			},
			'06_FMR': {
				sizes: [[300, 250]],
			},
		},
	};

	return a9Context[device];
}
