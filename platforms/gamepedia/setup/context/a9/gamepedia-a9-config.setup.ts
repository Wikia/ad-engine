import { A9ConfigSetup, DeviceMode, getDeviceMode } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class GamepediaA9ConfigSetup implements A9ConfigSetup {
	configureA9Context(): void {
		const mode: DeviceMode = getDeviceMode();

		context.set('bidders.a9.slots', this.getA9Context(mode));
	}

	private getA9Context(device: DeviceMode): any {
		const a9Context = {
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
}
