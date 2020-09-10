import {
	Binder,
	communicationService,
	context,
	Dictionary,
	DiProcess,
	ofType,
	Targeting,
	utils,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { shareReplay } from 'rxjs/operators';
import { viewRendered } from '../../../setup-bingebot';

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
		context.set('targeting', { ...context.get('targeting'), ...this.getPageLevelTargeting() });

		communicationService.action$
			.pipe(
				ofType(viewRendered),
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
