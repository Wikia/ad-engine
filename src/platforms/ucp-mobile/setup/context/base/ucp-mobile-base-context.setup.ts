import { BaseContextSetup } from '@platforms/shared';
import { context, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpMobileBaseContextSetup extends BaseContextSetup {
	execute(): void {
		super.execute();

		const isGamepedia = window.ads.context.opts.isGamepedia;
		const isLoggedIn = window.mw.config.get('wgUserId');

		if (isGamepedia && isLoggedIn) {
			this.noAdsDetector.addReason('gamepedia_loggedin_mobile_no_ads');
		}

		context.set(
			'custom.serverPrefix',
			utils.geoService.isProperCountry(['AU', 'NZ']) ? 'vm1b' : 'wka1b',
		);
	}
}
