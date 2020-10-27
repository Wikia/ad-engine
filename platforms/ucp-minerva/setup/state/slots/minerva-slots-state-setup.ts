import { slotsContext } from '@platforms/shared';
import { DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MinervaSlotsStateSetup implements DiProcess {
	execute(): void {
		slotsContext.setState('top_leaderboard', true);
		slotsContext.setState('top_boxad', true);
		slotsContext.setState('incontent_boxad_1', true);
		slotsContext.setState('footer_boxad', true);
	}
}
