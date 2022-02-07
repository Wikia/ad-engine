import { createIcon, icons } from '../icons';
import { onPlayClick } from '../listeners/player-play-click-listener';
import { communicationService, eventsRepository } from '@ad-engine/communication';

// @TODO Clean up this P1 ADEN-10294 hack
// It forces Safari to repaint the thumbnail
function forceRepaint(element): number {
	element.style.display = 'none';
	const width = element.offsetWidth;
	element.style.display = '';

	return width;
}

function showOverlay(overlay, params): void {
	if (!params.container.classList.contains('theme-hivi')) {
		overlay.style.width = overlay.style.width || getOverlayWidth(params);
	}
	// make overlay visible after ad finishes
	overlay.style.display = 'block';
}

/**
 * Basing on video width and total ad width compute width (in %)
 * of overlay to make it responsive.
 *
 * offsetWidth won't work in case video container is hidden.
 * @param params
 * @return string in form '55%'
 */
function getOverlayWidth(params): string {
	const adWidth = params.container.offsetWidth;
	const videoWidth = params.hideWhenPlaying.offsetWidth;

	return `${(100 * videoWidth) / adWidth}%`;
}

function addReplayIcon(overlay: HTMLElement): HTMLElement | null {
	const replayIcon = createIcon(icons.REPLAY, ['replay-icon', 'overlay-icon']);

	overlay.appendChild(replayIcon);

	return replayIcon;
}

function addPlayIcon(overlay): HTMLElement | null {
	const playIcon = createIcon(icons.PLAY, ['play-icon', 'overlay-icon']);

	overlay.appendChild(playIcon);

	return playIcon;
}

export class PlayerOverlay {
	static add(video, container, params): void {
		const overlay = document.createElement('div');

		overlay.classList.add('player-overlay');
		// TODO: remove below line once we update all creative templates in GAM or move the styles from GAM to AE
		overlay.classList.add('replay-overlay');
		overlay.addEventListener('click', () => {
			onPlayClick(
				video,
				communicationService,
				eventsRepository.AD_ENGINE_VIDEO_REPLAY_OVERLAY_CLICKED,
			);
		});

		if (!params.autoPlay) {
			showOverlay(overlay, params);
		}

		video.addEventListener('wikiaAdCompleted', () => {
			showOverlay(overlay, params);
			forceRepaint(container);
		});

		if (
			(video.params && video.params.theme && video.params.theme === 'hivi') ||
			(params.theme && params.theme === 'hivi')
		) {
			const replayIcon = addReplayIcon(overlay);

			if (!params.autoPlay) {
				const playIcon = addPlayIcon(overlay);

				replayIcon.style.display = 'none';

				video.addEventListener('start', () => {
					replayIcon.style.display = '';
					playIcon.style.display = 'none';
				});
			}

			const newContainer =
				video.params && video.params.thumbnail ? video.params.thumbnail : params.thumbnail;
			newContainer.appendChild(overlay);
			forceRepaint(newContainer);
		} else {
			container.parentElement.insertBefore(overlay, container);
		}

		forceRepaint(container);
	}
}
