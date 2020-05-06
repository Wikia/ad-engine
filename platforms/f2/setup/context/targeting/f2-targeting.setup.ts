import { TargetingSetup } from '@platforms/shared';
import {
	context,
	InstantConfigCacheStorage,
	InstantConfigService,
	Targeting,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { F2_ENV, F2Environment } from '../../../setup-f2';
import { F2State } from '../../../utils/f2-state';
import { F2_STATE } from '../../../utils/f2-state-binder';

@Injectable()
export class F2TargetingSetup implements TargetingSetup {
	constructor(
		@Inject(F2_ENV) private f2Env: F2Environment,
		@Inject(F2_STATE) private f2State: F2State,
		private instantConfig: InstantConfigService,
		private cacheStorage: InstantConfigCacheStorage,
	) {}

	configureTargetingContext(): void {
		context.set('targeting', this.getPageLevelTargeting());
	}

	private getPageLevelTargeting(): Partial<Targeting> {
		const targeting = {
			host: window.location.hostname,
			lang: 'en',
			outstream: 'none',
			post_id: '-1',
			skin: this.f2Env.skinName,
			s0: 'fandom',
			s1: '_fandom',
			s2: this.f2State.pageType === 'topic' ? 'vertical' : this.f2State.pageType,
			esrb: 'teen',
			labrador: this.cacheStorage.mapSamplingResults(
				this.instantConfig.get('icLABradorGamKeyValues'),
			),
		};

		return targeting;
	}
}
