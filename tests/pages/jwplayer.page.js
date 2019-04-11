import { timeouts } from '../common/timeouts';

class JWPlayer {
	constructor() {
		this.pageLink = 'video/jwplayer/';
		this.player = '.featured-video';

		this.playButton = '.jw-icon-playback';
		this.soundToggle = '.jw-icon-volume';
		this.soundToggleOff = '.jw-off';
		this.soundToggleOn = '.jw-full';
		this.fullscreenButton = '.jw-icon-fullscreen';
		this.fullscreenPlayer = '.jw-flag-fullscreen';
		this.videoIdle = '.jw-state-idle';
		this.playerAdContainer = '#playerContainer_googima';

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

	isAdVisible() {
		$(this.playerAdContainer).waitForExist(timeouts.standard);
		if (
			$(this.playerAdContainer)
				.getAttribute('style')
				.includes('visibility: visible')
		) {
			return true;
		}
		if (
			$(this.playerAdContainer)
				.getAttribute('style')
				.includes('visibility: hidden')
		) {
			return false;
		}

		return undefined;
	}

	waitForAdToChangeState(shouldAdBeVisible) {
		browser.waitUntil(() => this.isAdVisible() === shouldAdBeVisible, timeouts.standard);
	}
}

export const jwPlayer = new JWPlayer();
