import { PrebidConfig } from '@wikia/ad-bidders/prebid/prebid-models';

export function getVideoBiddersWithVideoSlots(biddersConfig: PrebidConfig) {
	return Object.keys(biddersConfig).filter(
		(configKey) =>
			biddersConfig[configKey]?.slots?.featured ||
			biddersConfig[configKey]?.slots?.incontent_player,
	);
}
