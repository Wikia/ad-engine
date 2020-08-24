import { TargetingSetup } from '@platforms/shared';
import {
	Binder,
	communicationService,
	context,
	Dictionary,
	globalAction,
	ofType,
	Targeting,
	utils,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { shareReplay } from 'rxjs/operators';
import { props } from 'ts-action';

interface NewViewRenderedProps {
	s2: string;
}

const newViewRendered = globalAction('[BingeBot] new view rendered', props<NewViewRenderedProps>());

const SKIN = Symbol('targeting skin');

@Injectable()
export class BingeBotTargetingSetup implements TargetingSetup {
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
				ofType(newViewRendered),
				shareReplay(1), // take only the newest value
			)
			.subscribe((action) => {
				context.set('targeting.s2', action.s2);
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
