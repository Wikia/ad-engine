import { slotsContext, SlotsStateSetup } from '@platforms/shared';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { F2State } from '../../../utils/f2-state';
import { F2_STATE } from '../../../utils/f2-state-binder';

@Injectable()
export class F2SlotsStateSetup implements SlotsStateSetup {
	constructor(@Inject(F2_STATE) private f2State: F2State) {}

	configureSlotsState(): void {
		switch (this.f2State.pageType) {
			case 'curated':
				slotsContext.setState('top_leaderboard', true);
				slotsContext.setState('bottom_leaderboard', true);
				break;
			case 'article':
				slotsContext.setState('top_leaderboard', !!this.f2State.hasFeaturedVideo);
				slotsContext.setState('bottom_leaderboard', true);
				slotsContext.setState('top_boxad', true);
				slotsContext.setState('incontent_boxad', true);
				break;
			case 'topic':
			case 'home':
				slotsContext.setState('top_leaderboard', true);
				slotsContext.setState('bottom_leaderboard', true);
				slotsContext.setState('top_boxad', true);
				slotsContext.setState('feed_boxad', true);
				break;
			case 'video':
			case 'page':
			default:
				break;
		}
	}
}
