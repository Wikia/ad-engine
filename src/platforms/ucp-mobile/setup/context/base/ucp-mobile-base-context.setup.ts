import { BaseContextSetup } from '@platforms/shared';
import { context, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { loadNewUap } from "../../../../../core/services/load-new-uap";

@Injectable()
export class UcpMobileBaseContextSetup extends BaseContextSetup {
	execute(): void {
		super.execute();

		context.set(
			'custom.serverPrefix',
			utils.geoService.isProperCountry(['AU', 'NZ']) ? 'vm1b' : 'wka1b',
		);

		context.set('uap.slots.toEnable', [
			'top_boxad',
			'mobile_prefooter',
			'bottom_leaderboard',
			'gallery_leaderboard',
		]);
		loadNewUap();
	}
}
