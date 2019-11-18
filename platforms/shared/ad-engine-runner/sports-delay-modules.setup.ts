import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { biddersDelay } from '../bidders/bidders-delay';
import { DelayModulesSetup } from '../setup/_delay-modules.setup';
import { babDetection } from '../wad/bab-detection';

@Injectable()
export class SportsDelayModulesSetup implements DelayModulesSetup {
	configureDelayModules(): void {
		context.push('delayModules', babDetection);
		context.push('delayModules', biddersDelay);
	}
}
