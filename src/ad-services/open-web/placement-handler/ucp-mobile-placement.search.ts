import { OpenWebPlacementSearchHandler } from './placement-search';

export class OpenWebUcpMobilePlacementSearch extends OpenWebPlacementSearchHandler {
	private readonly NO_OF_BOXAD_TO_BE_REPLACED = 3;
	private readonly SELECTOR = 'div[class*="-boxad"]'; // include top-boxad alongside with incontent

	init() {
		const boxes = document.querySelectorAll(this.SELECTOR);
		if (boxes.length <= this.NO_OF_BOXAD_TO_BE_REPLACED) {
			this.anchor = null;
			return;
		}

		this.anchor = boxes[this.NO_OF_BOXAD_TO_BE_REPLACED - 1];
		this.anchor.innerHTML = null;
	}
}
