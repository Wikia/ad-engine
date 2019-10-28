import { slots } from '../common/slot-registry';

class FloorAdhesion {
	constructor() {
		this.pageLink = 'templates/floor-adhesion/';
		this.cid = 'adeng-floor-adhesion';
		this.closeButton = `${slots.floorAdhesion.selector} .button-close`;
	}
}

export const floorAdhesion = new FloorAdhesion();
