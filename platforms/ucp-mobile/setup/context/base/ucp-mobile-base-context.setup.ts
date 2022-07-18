import { BaseContextSetup } from '@platforms/shared';
import { context, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpMobileBaseContextSetup extends BaseContextSetup {
	execute(): void {
		super.execute();

		context.set(
			'custom.serverPrefix',
			utils.geoService.isProperCountry(['AU', 'NZ']) ? 'vm1b' : 'wka1b',
		);

		context.set(
			'events.pushOnScroll.threshold',
			this.instantConfig.get('icPushOnScrollThreshold', 100),
		);
		context.set(
			'events.pushOnScroll.nativoThreshold',
			this.instantConfig.get('icPushOnScrollNativoThreshold', 200),
		);
	}
}
