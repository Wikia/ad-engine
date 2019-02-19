import { getTopOffset } from '../utils';
import { scrollListener } from '../listeners';

export class FloatingAd {
	static getName() {
		return 'floating-ad';
	}

	constructor(adSlot) {
		this.adSlot = adSlot;
	}

	init() {
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
			if (slotNode.previousElementSibling) {
				start =
					getTopOffset(slotNode.previousElementSibling) +
					slotNode.previousElementSibling.offsetHeight;
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
