import { context, DiProcess, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class SportsA9ConfigSetup implements DiProcess {
	execute(): void {
		const mode = context.get('state.isMobile') ? 'mobile' : 'desktop';

		context.set('bidders.a9.slots', this.getA9Context(mode));
	}

	private getA9Context(device: utils.DeviceMode): any {
		const a9Context = {
			desktop: {
				'01_LB': {
					sizes: [
						[728, 90],
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
				'04_BLB': {
					sizes: [[320, 50]],
				},
				'06_FMR': {
					sizes: [[300, 250]],
				},
			},
		};

		return a9Context[device];
	}
}
