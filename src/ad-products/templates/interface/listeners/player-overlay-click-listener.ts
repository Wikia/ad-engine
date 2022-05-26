export function onVideoOverlayClick(video, communicationService, eventToEmitOnPlay) {
	video.play();

	if (video.getPlayCounter() > 1) {
		// emit the event only if it's a replay (not first on-click play)
		communicationService.emit(eventToEmitOnPlay, {
			adSlotName: video.settings.getSlotName(),
			ad_status: 'replay-click',
		});
	}
}
