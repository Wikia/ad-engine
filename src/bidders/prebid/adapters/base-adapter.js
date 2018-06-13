export class BaseAdapter {
	constructor({ enabled, slots }) {
		this.enabled = enabled;
		this.slots = slots;
	}

	prepareAdUnits() {
		return Object
			.keys(this.slots)
			.map(
				slotName => this.prepareConfigForAdUnit(slotName, this.slots[slotName])
			);
	}
}
