import {
	communicationService,
	Dictionary,
	DiProcess,
	eventsRepository,
	ofType,
	SlotTargeting,
	targetingService,
	utils,
} from '@wikia/ad-engine';
import { shareReplay } from 'rxjs/operators';
import { injectable } from 'tsyringe';

@injectable()
export class BingeBotTargetingSetup implements DiProcess {
	execute(): void {
		targetingService.extend({
			...targetingService.dump(),
			...this.getPageLevelTargeting(),
		});

		communicationService.action$
			.pipe(
				ofType(communicationService.getGlobalAction(eventsRepository.BINGEBOT_VIEW_RENDERED)),
				shareReplay(1), // take only the newest value
			)
			.subscribe((action) => {
				targetingService.set('s2', action.viewType);
			});
	}

	getPageLevelTargeting(): Partial<SlotTargeting> {
		const pageTargeting: Dictionary<string> = {
			geo: utils.geoService.getCountryCode() || 'none',
			s0: 'ent',
			s2: 'bingebot_selection',
			skin: 'bingebot',
		};

		const cid = utils.queryString.get('cid');

		if (cid !== undefined) {
			pageTargeting.cid = cid;
		}

		return pageTargeting;
	}
}
