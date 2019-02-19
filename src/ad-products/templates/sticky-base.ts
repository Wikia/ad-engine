import { AdSlot, context, utils } from '@wikia/ad-engine';
import { Stickiness } from './uap/themes/hivi/stickiness';
import CloseButton from './interface/close-button';

const logGroup = 'sticky-base';

/**
 * @abstract
 */
export class StickyBase {
	static DEFAULT_UNSTICK_DELAY = 2000;

	/**
	 * Base class for sticky ads
	 * @param {AdSlot} adSlot
	 */
	constructor(adSlot) {
		this.adSlot = adSlot;
		this.container = this.adSlot.getElement();
		this.lineId = adSlot.lineItemId.toString() || '';
		this.lines = context.get(`templates.${this.getName()}.lineItemIds`) || [];
		this.stickiness = null;
		this.config = context.get(`templates.${this.getName()}`);
	}

	/**
	 * @protected
	 */
	setupStickiness(params) {
		this.params = params;

		this.adSlot.setConfigProperty('useGptOnloadEvent', true);
		this.adSlot.onLoad().then(() => {
			utils.logger(logGroup, this.adSlot.getSlotName(), 'slot ready for stickiness');
			this.adSlot.emitEvent(Stickiness.SLOT_STICKY_READY_STATE);
		});

		this.addStickinessPlugin();
	}

	/**
	 * @abstract
	 * @protected
	 */
	addStickinessPlugin() {
		throw new utils.NotImplementedException();
	}

	/**
	 * @protected
	 */
	isEnabled() {
		const isEnabledInContext = context.get(`templates.${this.getName()}.enabled`);
		const isEnabled = isEnabledInContext && this.isLineAndGeo();

		if (isEnabled) {
			utils.logger(logGroup, `enabled with line item id ${this.lineId}`);
		}

		return isEnabled;
	}

	/**
	 * Returns template name.
	 * @abstract
	 * @protected
	 * @return {string}
	 */
	getName() {
		throw new utils.NotImplementedException();
	}

	/**
	 * @private
	 */
	isLineAndGeo() {
		const found = this.lines.some((line) => {
			const [lineId, geo] = line.split(':', 2);

			return lineId === this.lineId && (!geo || utils.isProperGeo([geo]));
		});

		if (found) {
			utils.logger(logGroup, `line item ${this.lineId} enabled in geo`);
		}

		return found;
	}

	/**
	 * Runs logic which decides when to unstick the template.
	 * @protected
	 */
	addUnstickLogic() {
		const { stickyAdditionalTime, stickyUntilSlotViewed } = this.config;
		const whenSlotViewedOrTimeout = async () => {
			await (stickyUntilSlotViewed && !this.adSlot.isViewed()
				? utils.once(this.adSlot, AdSlot.SLOT_VIEWED_EVENT)
				: Promise.resolve());
			await utils.wait(StickyBase.DEFAULT_UNSTICK_DELAY + stickyAdditionalTime);
		};

		this.stickiness = new Stickiness(this.adSlot, whenSlotViewedOrTimeout());
	}

	/**
	 * @protected
	 */
	addButton(rootElement, cb) {
		this.button = new CloseButton({
			classNames: ['button-unstick'],
			onClick: cb,
		}).render();

		rootElement.appendChild(this.button);
	}

	/**
	 * @protected
	 */
	removeButton() {
		this.button.remove();
	}

	/**
	 * @protected
	 */
	addUnstickEvents() {
		this.stickiness.on(Stickiness.STICKINESS_CHANGE_EVENT, (isSticky) =>
			this.onStickinessChange(isSticky),
		);
		this.stickiness.on(Stickiness.CLOSE_CLICKED_EVENT, () => this.unstickImmediately());
		this.stickiness.on(Stickiness.UNSTICK_IMMEDIATELY_EVENT, () => this.unstickImmediately());
	}

	/**
	 * @abstract
	 * @protected
	 */
	onStickinessChange(isSticky) {
		throw new utils.NotImplementedException({ isSticky });
	}

	/**
	 * @abstract
	 * @protected
	 */
	unstickImmediately() {
		throw new utils.NotImplementedException();
	}
}
