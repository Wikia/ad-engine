// @ts-strict-ignore
import { communicationService, eventsRepository } from '@wikia/communication';

const dataset = {};
let offsetTop = 1000;

interface FakeElement {
	dataset: any;
	offsetTop: number;
	classList: {
		contains: () => void;
	};
	offsetHeight: number;
	getBoundingClientRect: () => {
		top: number;
		left: number;
	};
	offsetParent: null;
	ownerDocument: Record<string, unknown>;
}

export const adSlotFake = {
	name: 'FAKE_AD',
	config: {
		targeting: {
			rv: 1,
		},
		disabled: false,
		firstCall: true,
	},

	get enabled(): boolean {
		return !this.config.disabled;
	},

	set enabled(value) {
		this.config.disabled = !value;
	},

	getSlotName(): string {
		return this.name;
	},

	getViewportConflicts(): [] {
		return [];
	},

	getCopy(): { targeting: { rv: number } } {
		return JSON.parse(JSON.stringify(this.config));
	},

	hasDefinedViewportConflicts(): boolean {
		return false;
	},

	disable(): void {
		this.enabled = false;
	},

	enable(): void {
		this.enabled = true;
	},

	isEnabled(): boolean {
		return this.enabled;
	},

	isFirstCall(): boolean {
		return this.config.firstCall;
	},

	isRepeatable(): boolean {
		return false;
	},

	getStatus(): null {
		return null;
	},

	getConfigProperty(key): undefined | null {
		if (key === 'targeting.pos') {
			return this.config.targeting.pos;
		}

		return null;
	},

	getElement(): FakeElement {
		return {
			dataset,
			offsetTop,
			classList: {
				contains: () => {},
			},
			offsetHeight: 300,
			getBoundingClientRect: () => ({
				top: offsetTop + 300,
				left: 0,
			}),
			offsetParent: null,
			ownerDocument: {},
		};
	},

	setOffsetTop(offset): void {
		offsetTop = offset;
	},
	emit(event): void {
		communicationService.emit(eventsRepository.AD_ENGINE_SLOT_EVENT, {
			event,
			slot: this,
			adSlotName: this.getSlotName(),
		});
	},
};
