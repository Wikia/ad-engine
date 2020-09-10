import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

import { DeviceMode, getDeviceMode } from '../../models/device-mode';

@Injectable()
export class UcpGamepediaA9ConfigSetup implements DiProcess {
	execute(): void {
		const mode: DeviceMode = getDeviceMode();

		context.set('bidders.a9.slots', this.getA9Context(mode));
	}

	private getA9Context(device: DeviceMode): any {
		const a9Context = {
			desktop: {
				'01_LB': {
					sizes: [
						[728, 90],
						[970, 150],
						[970, 250],
					],
				},
				'02_MR': {
					sizes: [
						[300, 250],
						[300, 600],
					],
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
