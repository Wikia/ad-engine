import { babDetection, biddersDelay, DelayModulesSetup } from '@platforms/shared';
import { context, taxonomyService } from '@wikia/ad-engine';

export class GamepediaDelayModulesSetup implements DelayModulesSetup {
	configureDelayModules(): void {
		context.push('delayModules', babDetection);
		context.push('delayModules', biddersDelay);
		context.push('delayModules', taxonomyService);
	}
}
