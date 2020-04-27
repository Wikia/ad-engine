import { BaseContextSetup } from '@platforms/shared';
import { context, InstantConfigService, utils } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { F2_CONFIG, F2Config } from '../setup-f2';

@Injectable()
export class F2BaseContextSetup extends BaseContextSetup {
	constructor(@Inject(F2_CONFIG) private f2Config: F2Config, instantConfig: InstantConfigService) {
		super(instantConfig);
	}

	configureBaseContext(isMobile: boolean = false): void {
		super.configureBaseContext(isMobile);

		context.set(
			'custom.serverPrefix',
			utils.geoService.isProperCountry(['AU', 'NZ']) ? 'vm' : 'wka',
		);
		context.set('src', this.f2Config.src);
		context.set('custom.namespace', this.f2Config.namespace);
		context.set('custom.adLayout', this.f2Config.adLayout);
	}
}
