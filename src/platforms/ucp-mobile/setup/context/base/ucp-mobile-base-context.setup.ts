import { context } from '@ad-engine/core';
import { geoService } from '@ad-engine/utils';
import { BaseContextSetup } from '@platforms/shared';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpMobileBaseContextSetup extends BaseContextSetup {
	execute(): void {
		super.execute();

		context.set('custom.serverPrefix', geoService.isProperCountry(['AU', 'NZ']) ? 'vm1b' : 'wka1b');
	}
}
