import { OpenWebPlacementSearchHandler } from './placement-search';

export class OpenWebUcpDesktopPlacementSearch extends OpenWebPlacementSearchHandler {
	private readonly SELECTOR = '#WikiaAdInContentPlaceHolder';

	init() {
		const selector = this.SELECTOR;
		this.anchor = document.querySelector(selector);
	}
}
