import { slotService, slotTweaker } from '@ad-engine/core';
import { DEFAULT_VIDEO_ASPECT_RATIO } from '../../outstream/porvata-template';

/**
 * Add UI animations that expands once video ad starts and collapses the slot once video ad finishes
 * @param player Porvata video element
 * @param container Video container
 * @param params videoSettings parameters
 */
function add(player, container, params): void {
	const slot = slotService.get(params.slotName);

	let slotExpanded = false;

	player.addEventListener('loaded', () => {
		if (!slotExpanded) {
			slotTweaker.expand(slot);
			slotExpanded = true;

			// Delay dispatching event so it's run after browser really finish expanding the slot
			// Value 1000ms is related to animation defined in _porvata.scss file
			setTimeout(() => {
				player.dispatchEvent('wikiaSlotExpanded');
			}, 1000);
		}

		if (!player.isFloating) {
			const slotWidth = slot.getElement().scrollWidth;

			player.resize(slotWidth, slotWidth / DEFAULT_VIDEO_ASPECT_RATIO);
		}
	});

	player.addEventListener('allAdsCompleted', () => {
		slotTweaker.collapse(slot);
		player.dispatchEvent('wikiaSlotCollapsed');
	});
}

export default {
	add,
};
