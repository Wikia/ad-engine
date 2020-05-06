import { TargetingSetup } from '@platforms/shared';
import { InstantConfigCacheStorage, InstantConfigService, Targeting } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { F2_CONFIG, F2Config } from '../../../setup-f2';

@Injectable()
export class F2TargetingSetup implements TargetingSetup {
	constructor(
		@Inject(F2_CONFIG) private f2Config: F2Config,
		private instantConfig: InstantConfigService,
		private cacheStorage: InstantConfigCacheStorage,
	) {}

	configureTargetingContext(): void {}

	private getPageLevelTargeting(): Partial<Targeting> {
		const targeting = {
			host: window.location.hostname,
			lang: 'en',
			outstream: 'none',
			post_id: '-1',
			// skin: env.getSkinName(), // TODO
			s0: 'fandom',
			s1: '_fandom',
			s2: this.f2Config.pageType === 'topic' ? 'vertical' : this.f2Config.pageType,
			esrb: 'teen',
			labrador: this.cacheStorage.mapSamplingResults(
				this.instantConfig.get('icLABradorGamKeyValues'),
			),
		};
	}
}
