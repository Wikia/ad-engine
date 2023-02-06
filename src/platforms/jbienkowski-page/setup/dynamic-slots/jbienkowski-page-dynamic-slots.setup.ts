import { DiProcess, slotInjector, slotService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class JbienkowskiPageDynamicSlotsSetup implements DiProcess {
	execute(): void {
		slotService.enable('top_leaderboard');
		slotInjector.inject('top_leaderboard', true);
	}
}
