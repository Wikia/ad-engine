import { communicationService, eventsRepository } from '@wikia/communication/index';

const dataset: any = {};

let offsetTop = 1000;

export default {
	name: 'FAKE_AD',
	config: {
		targeting: {
			wsi: 'yyyy',
			rv: 1,
		},
		disabled: false,
		firstCall: true,
	},

	get enabled() {
		return !this.config.disabled;
	},

	set enabled(value) {
		this.config.disabled = !value;
	},

	getSlotName() {
		return this.name;
	},

	getViewportConflicts() {
		return [];
	},

	getCopy() {
		return JSON.parse(JSON.stringify(this.config));
	},

	hasDefinedViewportConflicts() {
		return false;
	},

	disable() {
		this.enabled = false;
	},

	enable() {
		this.enabled = true;
	},

	isEnabled() {
		return this.enabled;
	},

	isFirstCall() {
		return this.config.firstCall;
	},

	isRepeatable() {
		return false;
	},

	getStatus() {
		return null;
	},

	getConfigProperty(key) {
		if (key === 'targeting.pos') {
			return this.config.targeting.pos;
		}

		return null;
	},

	getElement() {
		return {
			classList: {
				contains: () => {},
			},
			dataset,
			offsetHeight: 300,
			offsetTop,
			getBoundingClientRect: () => ({
				top: offsetTop + 300,
				left: 0,
			}),
			offsetParent: null,
			ownerDocument: {},
		};
	},

	setOffsetTop(offset) {
		offsetTop = offset;
	},
	getSlotsToPushAfterCreated() {
		return [];
	},
	getSlotsToInjectAfterRendered() {
		return [];
	},
	emit(event) {
		communicationService.emit(eventsRepository.AD_ENGINE_SLOT_EVENT, {
			event,
			slot: this,
			adSlotName: this.getSlotName(),
		});
	},
};
