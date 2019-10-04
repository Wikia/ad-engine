import { context, InstantConfigService, utils } from '@wikia/ad-engine';
import { slotsContext } from '../slots';

class UapHelper {
	firstCallSlotName = 'cdm-zone-01';

	async configureUap(): Promise<void> {
		const instantConfig = await InstantConfigService.init();

		if (!this.isUapAllowed(instantConfig.get('icUapRestriction'))) {
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

export const uapHelper = new UapHelper();
