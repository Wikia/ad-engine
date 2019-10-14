import { slotService, utils } from '@ad-engine/core';
import {
	DEFAULT_VIDEO_ASPECT_RATIO,
	FLOATING_VIDEO_ASPECT_RATIO,
} from '../../outstream/porvata-template';
import { CloseButton } from '../close-button';

const FLOATING_CLASS_NAME = 'outstream-floating';

/**
 * Makes the video element floating once main container is out of viewport
 * @param video Porvata video element
 * @param container Video container
 * @param params videoSettings parameters
 */
function add(video, container, params): void {
	if (!params.isFloatingEnabled) {
		return;
	}

	const slotElement = slotService.get(params.slotName).getElement();
	const videoOverlay: HTMLElement = slotElement.querySelector('.video-overlay');
	const videoWrapper: HTMLElement = slotElement.querySelector('.video-display-wrapper');

	video.addEventListener('wikiaSlotExpanded', () => {
		const observer = utils.viewportObserver.addListener(
			videoOverlay,
			(inViewport) => {
				if (inViewport) {
					slotElement.classList.remove(FLOATING_CLASS_NAME);
				} else {
					slotElement.classList.add(FLOATING_CLASS_NAME);
				}

				video.isFloating = !inViewport;
				const width = videoWrapper.offsetWidth;
				const aspectRatio = inViewport ? DEFAULT_VIDEO_ASPECT_RATIO : FLOATING_VIDEO_ASPECT_RATIO;

				video.resize(width, width / aspectRatio);
			},
			{
				offsetTop: params.inViewportOffsetTop,
				offsetBottom: params.inViewportOffsetBottom,
				areaThreshold: 1,
			},
		);
		const disableFloating = () => {
			video.isFloating = false;
			slotElement.classList.remove(FLOATING_CLASS_NAME);
			utils.viewportObserver.removeListener(observer);
			const width = videoWrapper.offsetWidth;

			video.resize(width, width / DEFAULT_VIDEO_ASPECT_RATIO);
			video.ima.dispatchEvent('wikiaXCLick');
		};
		const closeButton = new CloseButton({
			onClick: disableFloating,
		});

		container.parentNode.insertBefore(closeButton.render(), container);
		video.addEventListener('wikiaAdCompleted', disableFloating);
	});
}

export default {
	add,
};
