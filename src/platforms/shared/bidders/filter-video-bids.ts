import { context } from '@ad-engine/core';

export function filterVideoBids(bidderContext) {
	const hasFeaturedVideo = context.get('custom.hasFeaturedVideo');
	const bidConfigSlotNames = Object.keys(bidderContext.slots);
	const hasFeaturedBidConfig = bidderContext.slots && bidConfigSlotNames.includes('featured');
	const hasIncontentPlayerBidConfig =
		bidderContext.slots && bidConfigSlotNames.includes('incontent_player');
	const newVideoSlotsConfig = {
		...bidderContext.slots,
	};

	if (hasFeaturedVideo && hasIncontentPlayerBidConfig) {
		delete newVideoSlotsConfig['incontent_player'];
	} else if (!hasFeaturedVideo && hasFeaturedBidConfig) {
		delete newVideoSlotsConfig['featured'];
	}

	return {
		...bidderContext,
		slots: newVideoSlotsConfig,
	};
}
