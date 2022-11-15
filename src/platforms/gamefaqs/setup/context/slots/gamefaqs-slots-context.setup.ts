import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class GamefaqsSlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			leader_plus_top: {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[970, 250],
				],
			},
			mpu_top: {
				defaultSizes: [[300, 250]],
			},
		};

		context.set('slots', slots);
	}
}
