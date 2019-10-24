import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { biddersDelay } from '../../../bidders/bidders-delay';
import { babDetection } from '../../../wad/bab-detection';
import { DelayModulesSetup } from './_delay-modules.setup';

@Injectable()
export class SportsDelayModulesSetup implements DelayModulesSetup {
	configureDelayModules(): void {
		context.push('delayModules', babDetection);
		context.push('delayModules', biddersDelay);
	}
}
