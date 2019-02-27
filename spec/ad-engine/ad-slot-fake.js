import { LazyQueue } from '@wikia/ad-engine/utils';

const dataset = {};

let offsetTop = 1000;

export default {
	events: new LazyQueue(),

	getSlotName() {
		return 'FAKE_AD';
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

	isEnabled() {
		return true;
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
			offsetParent: null,
			ownerDocument: {},
		};
	},

	setOffsetTop(offset) {
		offsetTop = offset;
	},

	config: {
		targeting: {
			wsi: 'yyyy',
			rv: 1,
		},
	},
};
