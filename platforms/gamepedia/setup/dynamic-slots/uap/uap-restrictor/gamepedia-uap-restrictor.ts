import { UapRestrictor } from '@platforms/shared';
import { context, InstantConfigService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class GamepediaUapRestrictor implements UapRestrictor {
	constructor(private instantConfig: InstantConfigService) {}

	isUapAllowed(): boolean {
		let uapRestriction = this.instantConfig.get('icUapRestriction') || 0;
		const queryParam = utils.queryString.get('uap-pv-restriction');

		if (typeof queryParam !== 'undefined') {
			uapRestriction = parseInt(queryParam, 10);
		}

		return (
			uapRestriction === window.pvNumber || uapRestriction === 0 || context.get('src') === 'test'
		);
	}
}
