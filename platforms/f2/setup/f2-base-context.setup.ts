import { BaseContextSetup, NoAdsDetector } from '@platforms/shared';
import { context, InstantConfigService, utils } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { F2SrcAdapter } from '../utils/f2-src-adapter';
import { F2State } from '../utils/f2-state';
import { F2_STATE } from '../utils/f2-state-binder';

@Injectable()
export class F2BaseContextSetup extends BaseContextSetup {
	constructor(
		@Inject(F2_STATE) private f2State: F2State,
		private srcAdapter: F2SrcAdapter,
		instantConfig: InstantConfigService,
		noAdsDetector: NoAdsDetector,
	) {
		super(instantConfig, noAdsDetector);
	}

	configureBaseContext(isMobile: boolean = false): void {
		super.configureBaseContext(isMobile);

		if (this.f2State.article?.isArticlePlus) {
			this.noAdsDetector.addReason('article_plus');
		}

		if (window.location.hostname.includes('wikia.org')) {
			this.noAdsDetector.addReason('org');
		}

		context.set('src', this.srcAdapter.getSrcBasedOnEnv());
		context.set(
			'custom.serverPrefix',
			utils.geoService.isProperCountry(['AU', 'NZ']) ? 'vm' : 'wka',
		);
		context.set(
			'custom.adLayout',
			`${this.f2State.hasFeaturedVideo ? 'fv-' : ''}${this.f2State.pageType}`,
		);
	}
}
