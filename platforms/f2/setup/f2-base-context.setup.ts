import { BaseContextSetup } from '@platforms/shared';
import { context, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class F2BaseContextSetup extends BaseContextSetup {
	configureBaseContext(isMobile: boolean = false): void {
		super.configureBaseContext(isMobile);

		context.set(
			'custom.serverPrefix',
			utils.geoService.isProperCountry(['AU', 'NZ']) ? 'vm' : 'wka',
		);
	}
}
