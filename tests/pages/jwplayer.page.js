import { timeouts } from '../common/timeouts';

class JWPlayer {
	constructor() {
		this.pageLink = 'video/jwplayer/';
		this.player = '.featured-video';

		this.playButton = '.jw-icon-playback';
		this.soundToggle = '.jw-icon-volume';
		this.soundToggleOff = '.jw-off';
		this.soundToggleOn = '.jw-svg-icon-volume-0';
		this.fullscreenButton = '.jw-icon-fullscreen';
		this.fullscreenPlayer = '.jw-flag-fullscreen';
		this.videoIdle = '.jw-state-idle';
		this.playerAdContainer = '#playerContainer_googima';
		this.videoAd = '.jw-flag-ads';

		this.prerollDuration = 30000;
		this.midrollDuration = 30000;
		this.postrollDuration = 30000;
		this.f15nDuration = 15000;
		this.videoDuration = 75000;
		this.playerWidth = 628;
		this.playerHeight = 353;
	}

	isAudioOn() {
		$(this.player).waitForExist(timeouts.standard);
		if ($(`${this.soundToggle}${this.soundToggleOn}`).isExisting()) {
			return true;
		}
		$(`${this.soundToggle}${this.soundToggleOff}`).waitForExist(timeouts.standard);

		return false;
	}

	isVideoAdVisible() {
		$(this.playerAdContainer).waitForExist(timeouts.standard);
		return $(this.videoAd).isExisting();
	}
	waitForAdToChangeState(shouldAdBeVisible) {
		browser.waitUntil(() => this.isVideoAdVisible() === shouldAdBeVisible, timeouts.standard);
	}
}

export const jwPlayer = new JWPlayer();
