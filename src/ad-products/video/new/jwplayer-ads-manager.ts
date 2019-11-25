import { Communicator } from '@wikia/post-quecast';

export class JWPlayerAdsManager {
	communicator = new Communicator();

	// on
	// // adImpression,
	// // adsManager,
	// // adBlock,
	// // beforePlay,
	// // videoMidPoint,
	// // beforeComplete,
	// // complete,
	// // adRequest
	// // adImpression,
	// // adError
	// getMute
	// getConfig -> autostart
	// getPlaylistItem
	// playAd()

	// events
	// adImpression -> event, ima (x), tag (/)
	// adsManager (x) -> adsManager, videoElement
	// adRequest -> ima (x), tag (/)
	// adError -> ima, tag (/), adPlayId (x), message (/), adErrorCode (x)
	// hdPlayerEvent (x) -> details.slotStatus.{vastParams, statusName}, details.name, details.errorCode
}
