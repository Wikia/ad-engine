import { PorvataPlayer, slotTweaker } from '@wikia/ad-engine';
import ToggleAnimation from '../../../interface/video/toggle-animation';
import { resolvedState } from '../../resolved-state';
import { universalAdPackage } from '../../universal-ad-package';
import { VideoSettings } from '../../video-settings';
import { BigFancyAdTheme } from '../theme';

/**
 * @abstract
 */
class BigFancyAdClassicTheme extends BigFancyAdTheme {
	onAdReady(): void {
		if (universalAdPackage.isVideoEnabled(this.params)) {
			const videoSettings: VideoSettings = new VideoSettings(this.params);

			if (videoSettings.isSplitLayout()) {
				const theme: string =
					videoSettings.getParams().splitLayoutVideoPosition === 'right'
						? 'theme-split-right'
						: 'theme-split-left';

				this.params.container.classList.add(theme);
			} else if (!videoSettings.isAutoPlay()) {
				document.body.classList.add('ctp-vuap-loaded');
			}
		}
	}

	async adIsReady(videoSettings: VideoSettings): Promise<HTMLIFrameElement> {
		await resolvedState.setImage(videoSettings);

		return slotTweaker.makeResponsive(this.adSlot, this.params.aspectRatio);
	}
}

export class BfaaTheme extends BigFancyAdClassicTheme {
	onVideoReady(video: PorvataPlayer): void {
		if (!this.params.splitLayoutVideoPosition) {
			video.addEventListener('wikiaAdStarted', () => {
				this.recalculatePaddingTop(this.params.videoAspectRatio);
			});

			video.addEventListener('wikiaAdCompleted', () => {
				this.recalculatePaddingTop(this.params.aspectRatio);
			});
		}
	}

	private recalculatePaddingTop(finalAspectRatio: number): void {
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
