import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { getAppnexusContext } from '../../../bidders/prebid/appnexus';
import { getAppnexusAstContext } from '../../../bidders/prebid/appnexus-ast';
import { getFreewheelContext } from '../../../bidders/prebid/freewheel';
import { getGumgumContext } from '../../../bidders/prebid/gumgum';
import { getIndexExchangeContext } from '../../../bidders/prebid/index-exchange';
import { getKargoContext } from '../../../bidders/prebid/kargo';
import { getMagniteS2sContext } from '../../../bidders/prebid/magniteS2s';
import { getMedianetContext } from '../../../bidders/prebid/medianet';
import { getNobidContext } from '../../../bidders/prebid/nobid';
import { getOguryContext } from '../../../bidders/prebid/ogury';
import { getOpenXContext } from '../../../bidders/prebid/openx';
import { getOzoneContext } from '../../../bidders/prebid/ozone';
import { getPubmaticContext } from '../../../bidders/prebid/pubmatic';
import { getRubiconContext } from '../../../bidders/prebid/rubicon';
import { getRubiconDisplayContext } from '../../../bidders/prebid/rubicon-display';
import { getTripleliftContext } from '../../../bidders/prebid/triplelift';
import { getVerizonContext } from '../../../bidders/prebid/verizon';
import { getWebadsContext } from '../../../bidders/prebid/webads';
import { getWikiaContext } from '../../../bidders/prebid/wikia';
import { getWikiaVideoContext } from '../../../bidders/prebid/wikia-video';

function toggleVideoSlotsBids(bidderContext) {
	const hasFeaturedVideo = context.get('custom.hasFeaturedVideo');
	const bidConfigSlotNames = Object.keys(bidderContext.slots);
	const hasBidderVideoSlots =
		bidderContext.slots &&
		(bidConfigSlotNames.includes('featured') || bidConfigSlotNames.includes('incontent_player'));

	if (hasBidderVideoSlots && hasFeaturedVideo) {
		const newVideoSlotsConfig = {
			featured: { ...bidderContext.slots['featured'] },
		};

		return {
			...bidderContext,
			slots: newVideoSlotsConfig,
		};
	} else if (hasBidderVideoSlots) {
		const newVideoSlotsConfig = {
			incontent_player: { ...bidderContext.slots['incontent_player'] },
		};

		return {
			...bidderContext,
			slots: newVideoSlotsConfig,
		};
	}

	return bidderContext;
}

@Injectable()
export class UcpMobilePrebidConfigSetup implements DiProcess {
	execute(): void {
		context.set('bidders.prebid.appnexus', toggleVideoSlotsBids(getAppnexusContext()));
		context.set('bidders.prebid.appnexusAst', toggleVideoSlotsBids(getAppnexusAstContext()));
		context.set('bidders.prebid.freewheel', toggleVideoSlotsBids(getFreewheelContext()));
		context.set('bidders.prebid.gumgum', toggleVideoSlotsBids(getGumgumContext()));
		context.set('bidders.prebid.indexExchange', toggleVideoSlotsBids(getIndexExchangeContext()));
		context.set('bidders.prebid.kargo', toggleVideoSlotsBids(getKargoContext()));
		context.set('bidders.prebid.mgnipbs', toggleVideoSlotsBids(getMagniteS2sContext()));
		context.set('bidders.prebid.medianet', toggleVideoSlotsBids(getMedianetContext()));
		context.set('bidders.prebid.nobid', toggleVideoSlotsBids(getNobidContext()));
		context.set('bidders.prebid.ogury', toggleVideoSlotsBids(getOguryContext()));
		context.set('bidders.prebid.openx', toggleVideoSlotsBids(getOpenXContext()));
		context.set('bidders.prebid.ozone', toggleVideoSlotsBids(getOzoneContext()));
		context.set('bidders.prebid.pubmatic', toggleVideoSlotsBids(getPubmaticContext()));
		context.set('bidders.prebid.relevantdigital', toggleVideoSlotsBids(getWebadsContext()));
		context.set('bidders.prebid.rubicon', toggleVideoSlotsBids(getRubiconContext()));
		context.set('bidders.prebid.rubicon_display', toggleVideoSlotsBids(getRubiconDisplayContext()));
		context.set('bidders.prebid.triplelift', toggleVideoSlotsBids(getTripleliftContext()));
		context.set('bidders.prebid.verizon', toggleVideoSlotsBids(getVerizonContext()));
		context.set('bidders.prebid.wikia', toggleVideoSlotsBids(getWikiaContext()));
		context.set('bidders.prebid.wikiaVideo', toggleVideoSlotsBids(getWikiaVideoContext()));
	}
}
