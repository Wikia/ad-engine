import { DeviceMode, getDeviceMode } from '../models/device-mode';
import { getWikiaContext } from './repository/wikia';

class BiddersContext {
	private mode: DeviceMode = getDeviceMode();

	private getBidderContext(generatorCallback): any {
		return generatorCallback ? generatorCallback(this.mode) : undefined;
	}

	generate(bidders: any = {}): any {
		const {
			getA9Context,
			getAppNexusContext,
			getIndexExchangeContext,
			getOpenXContext,
			getPubmaticContext,
			getRubiconContext,
		} = bidders;

		return {
			enabled: false,
			timeout: 2000,
			a9: {
				enabled: false,
				dealsEnabled: false,
				videoEnabled: false,
				amazonId: '3115',
				slots: this.getBidderContext(getA9Context),
			},
			prebid: {
				enabled: false,
				libraryUrl:
					'https://slot1.fandom.com/__am/155542168020822/one/minify%3D1/extensions/wikia/AdEngine3/dist/vendors/prebid.js',
				lazyLoadingEnabled: false,
				bidsRefreshing: {
					enabled: false,
					slots: [],
				},
				appnexus: this.getBidderContext(getAppNexusContext),
				indexExchange: this.getBidderContext(getIndexExchangeContext),
				openx: this.getBidderContext(getOpenXContext),
				pubmatic: this.getBidderContext(getPubmaticContext),
				rubicon_display: this.getBidderContext(getRubiconContext),
				wikia: getWikiaContext(this.mode),
			},
		};
	}
}

export const biddersContext = new BiddersContext();
