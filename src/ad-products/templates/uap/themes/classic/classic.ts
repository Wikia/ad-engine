import { slotTweaker } from '@wikia/ad-engine';
import ToggleAnimation from '../../../interface/video/toggle-animation';
import { resolvedState } from '../../resolved-state';
import { universalAdPackage } from '../../universal-ad-package';
import { VideoSettings } from '../../video-settings';
import { BigFancyAdTheme } from '../theme';

/**
 * @abstract
 */
class BigFancyAdClassicTheme extends BigFancyAdTheme {
	onAdReady() {
		if (universalAdPackage.isVideoEnabled(this.params)) {
			const videoSettings = new VideoSettings(this.params);

			if (videoSettings.isSplitLayout()) {
				const theme =
					videoSettings.getParams().splitLayoutVideoPosition === 'right'
						? 'theme-split-right'
						: 'theme-split-left';

				this.params.container.classList.add(theme);
			} else if (!videoSettings.isAutoPlay()) {
				document.body.classList.add('ctp-vuap-loaded');
			}
		}
	}

	async adIsReady(videoSettings) {
		await resolvedState.setImage(videoSettings);

		return slotTweaker.makeResponsive(this.adSlot, this.params.aspectRatio);
	}
}

export class BfaaTheme extends BigFancyAdClassicTheme {
	onVideoReady(video) {
		if (!this.params.splitLayoutVideoPosition) {
			video.addEventListener('wikiaAdStarted', () => {
				this.recalculatePaddingTop(this.params.videoAspectRatio);
			});

			video.addEventListener('wikiaAdCompleted', () => {
				this.recalculatePaddingTop(this.params.aspectRatio);
			});
		}
	}

	/**
	 * @private
	 * @param finalAspectRatio
	 */
	recalculatePaddingTop(finalAspectRatio) {
		this.config.mainContainer.style.paddingTop = `${100 / finalAspectRatio}%`;

		this.container.style.height = `${this.container.offsetHeight}px`;
		// get offsetWidth from existing DOM element in order to force repaint
		this.container.style.height = `${this.container.offsetWidth / finalAspectRatio}px`;

		setTimeout(() => {
			// clear height so ad is responsive again
			this.container.style.height = '';
		}, ToggleAnimation.duration);
	}
}

export class BfabTheme extends BigFancyAdClassicTheme {}
