import {
	Binder,
	communicationService,
	Dictionary,
	DiProcess,
	eventsRepository,
	ofType,
	Targeting,
	targetingService,
	utils,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { shareReplay } from 'rxjs/operators';

const SKIN = Symbol('targeting skin');

@Injectable()
export class BingeBotTargetingSetup implements DiProcess {
	static skin(skin: string): Binder {
		return {
			bind: SKIN,
			value: skin,
		};
	}

	constructor(@Inject(SKIN) private skin: string) {}

	execute(): void {
		targetingService.extend({ ...targetingService.getAll(), ...this.getPageLevelTargeting() });

		communicationService.action$
			.pipe(
				ofType(communicationService.getGlobalAction(eventsRepository.BINGEBOT_VIEW_RENDERED)),
				shareReplay(1), // take only the newest value
			)
			.subscribe((action) => {
				targetingService.set('s2', action.viewType);
			});
	}

	getPageLevelTargeting(): Partial<Targeting> {
		const pageTargeting: Dictionary<string> = {
			geo: utils.geoService.getCountryCode() || 'none',
			s0: 'ent',
			s2: 'bingebot_selection',
			skin: this.skin,
		};

		const cid = utils.queryString.get('cid');

		if (cid !== undefined) {
			pageTargeting.cid = cid;
		}

		return pageTargeting;
	}
}
