import { context, InstantConfigService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { slotsContext } from '../../../slots/slots';
import { UapSetup } from './_uap.setup';

@Injectable()
export class CurseUapSetup implements UapSetup {
	private firstCallSlotName = 'cdm-zone-01';

	constructor(private instantConfig: InstantConfigService) {}

	configureUap(): void {
		if (!this.isUapAllowed(this.instantConfig.get('icUapRestriction'))) {
			return;
		}

		const uapSize: [number, number] = context.get('state.isMobile') ? [2, 2] : [3, 3];
		slotsContext.addSlotSize(this.firstCallSlotName, uapSize);
	}

	private isUapAllowed(restriction: number): boolean {
		let uapRestriction = restriction || 0;
		const queryParam = utils.queryString.get('uap-pv-restriction');

		if (typeof queryParam !== 'undefined') {
			uapRestriction = parseInt(queryParam, 10);
		}

		return (
			uapRestriction === window.pvNumber || uapRestriction === 0 || context.get('src') === 'test'
		);
	}
}
