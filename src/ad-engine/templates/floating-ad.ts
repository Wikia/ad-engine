import { scrollListener } from '../listeners';
import { AdSlot } from '../models';
import { getTopOffset } from '../utils';

export class FloatingAd {
	static getName() {
		return 'floating-ad';
	}

	constructor(public adSlot: AdSlot) {}

	init(): void {
		const slotNode = document.getElementById(this.adSlot.getSlotName());
		let container;
		let containerOffset;
		let end;
		let slotHeight;
		let space;
		let start = 0;

		if (!slotNode || !slotNode.classList.contains('floating')) {
			return;
		}

		scrollListener.addCallback(() => {
			const scrollPosition =
				window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

			container = slotNode.parentNode;
			containerOffset = getTopOffset(container);
			slotHeight = slotNode.offsetHeight;
			end = containerOffset + container.offsetHeight - slotHeight;

			start = containerOffset;
			const previousElementSibling = slotNode.previousElementSibling as HTMLElement | null;
			if (previousElementSibling) {
				start = getTopOffset(previousElementSibling) + previousElementSibling.offsetHeight;
			}

			space = end - start;
			if (space <= slotHeight) {
				slotNode.classList.add('pinned-top');
				slotNode.classList.remove('pinned-bottom');

				return;
			}

			if (scrollPosition <= start) {
				slotNode.classList.add('pinned-top');
				slotNode.classList.remove('pinned-bottom');
			} else if (scrollPosition >= end) {
				slotNode.classList.add('pinned-bottom');
				slotNode.classList.remove('pinned-top');
			} else {
				slotNode.classList.remove('pinned-top');
				slotNode.classList.remove('pinned-bottom');
			}
		});
	}
}
