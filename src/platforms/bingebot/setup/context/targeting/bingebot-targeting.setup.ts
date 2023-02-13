import {
	Binder,
	communicationService,
	context,
	Dictionary,
	DiProcess,
	eventsRepository,
	ofType,
	Targeting,
	utils,
} from '@wikia/ad-engine';
import { shareReplay } from 'rxjs/operators';
import { inject, injectable } from 'tsyringe';

const SKIN = Symbol('targeting skin');

@injectable()
export class BingeBotTargetingSetup implements DiProcess {
	static skin(skin: string): Binder<typeof skin> {
		return [SKIN, { useValue: skin }];
	}

	constructor(@inject(SKIN) private skin: string) {}

	execute(): void {
		context.set('targeting', { ...context.get('targeting'), ...this.getPageLevelTargeting() });

		communicationService.action$
			.pipe(
				ofType(communicationService.getGlobalAction(eventsRepository.BINGEBOT_VIEW_RENDERED)),
				shareReplay(1), // take only the newest value
			)
			.subscribe((action) => {
				context.set('targeting.s2', action.viewType);
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
