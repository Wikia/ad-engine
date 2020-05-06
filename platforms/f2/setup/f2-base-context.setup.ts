import { BaseContextSetup } from '@platforms/shared';
import { context, InstantConfigService, utils } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { F2_ENV, F2Environment } from '../setup-f2';
import { F2State } from '../utils/f2-state';
import { F2_STATE } from '../utils/f2-state-binder';

@Injectable()
export class F2BaseContextSetup extends BaseContextSetup {
	constructor(
		@Inject(F2_ENV) private f2Env: F2Environment,
		@Inject(F2_STATE) private f2State: F2State,
		instantConfig: InstantConfigService,
	) {
		super(instantConfig);
	}

	configureBaseContext(isMobile: boolean = false): void {
		super.configureBaseContext(isMobile);

		context.set('src', this.f2Env.src);
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
