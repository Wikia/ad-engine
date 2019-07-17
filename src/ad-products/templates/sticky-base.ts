import { AdSlot, context, Dictionary, utils } from '@ad-engine/core';
import { CloseButton } from './interface/close-button';
import { Stickiness } from './uap/themes/hivi/stickiness';

const logGroup = 'sticky-base';

/**
 * @abstract
 */
export class StickyBase {
	static DEFAULT_UNSTICK_DELAY = 2000;

	protected container: HTMLElement;
	protected lineId: string;
	protected lines: string[];
	protected stickiness: Stickiness;
	protected config: Dictionary;
	protected params: Dictionary;
	protected button: HTMLElement;

	/**
	 * Base class for sticky ads
	 */
	constructor(protected adSlot: AdSlot) {
		this.container = this.adSlot.getElement();
		this.lineId = adSlot.lineItemId.toString() || '';
		this.lines = context.get(`templates.${this.getName()}.lineItemIds`) || [];
		this.lines = this.lines.map((el) => el.toString());
		this.config = context.get(`templates.${this.getName()}`) || {};
	}

	protected setupStickiness(params: Dictionary): void {
		this.params = params;

		this.adSlot.setConfigProperty('useGptOnloadEvent', true);
		this.adSlot.loaded.then(() => {
			utils.logger(logGroup, this.adSlot.getSlotName(), 'slot ready for stickiness');
			this.adSlot.emitEvent(Stickiness.SLOT_STICKY_READY_STATE);
		});

		this.addStickinessPlugin();
	}

	/**
	 * @abstract
	 */
	protected addStickinessPlugin(): void {
		throw new utils.NotImplementedException();
	}

	protected isEnabled(): boolean {
		const isEnabledInContext: boolean = context.get(`templates.${this.getName()}.enabled`);
		const isEnabled: boolean = isEnabledInContext && this.isLineAndGeo();

		if (isEnabled) {
			utils.logger(logGroup, `enabled with line item id ${this.lineId}`);
		}

		return isEnabled;
	}

	/**
	 * Returns template name.
	 * @abstract
	 */
	protected getName(): string {
		throw new utils.NotImplementedException();
	}

	private isLineAndGeo(): boolean {
		const found: boolean = this.lines.some((line) => {
			const [lineId, geo] = line.split(':', 2);

			return lineId === this.lineId && (!geo || utils.geoService.isProperGeo([geo]));
		});

		if (found) {
			utils.logger(logGroup, `line item ${this.lineId} enabled in geo`);
		}

		return found;
	}

	/**
	 * Runs logic which decides when to unstick the template.
	 */
	protected addUnstickLogic(): void {
		const {
			stickyAdditionalTime,
			stickyDefaultTime = StickyBase.DEFAULT_UNSTICK_DELAY,
			stickyUntilSlotViewed,
		} = this.config;
		const whenSlotViewedOrTimeout = async () => {
			await (stickyUntilSlotViewed
				? this.adSlot.loaded.then(() => this.adSlot.viewed)
				: Promise.resolve());
			await utils.wait(stickyDefaultTime + stickyAdditionalTime);
		};

		this.stickiness = new Stickiness(this.adSlot, whenSlotViewedOrTimeout(), stickyUntilSlotViewed);
	}

	protected addButton(rootElement, cb): void {
		this.button = new CloseButton({
			classNames: ['button-unstick'],
			onClick: cb,
		}).render();

		rootElement.appendChild(this.button);
	}

	protected removeButton(): void {
		this.button.remove();
	}

	protected addUnstickEvents(): void {
		this.stickiness.on(Stickiness.STICKINESS_CHANGE_EVENT, (isSticky) =>
			this.onStickinessChange(isSticky),
		);
		this.stickiness.on(Stickiness.CLOSE_CLICKED_EVENT, () => this.unstickImmediately());
		this.stickiness.on(Stickiness.UNSTICK_IMMEDIATELY_EVENT, () => this.unstickImmediately());
	}

	/**
	 * @abstract
	 */
	protected onStickinessChange(isSticky: boolean): void {
		throw new utils.NotImplementedException({ isSticky });
	}

	/**
	 * @abstract
	 */
	protected unstickImmediately(): void {
		throw new utils.NotImplementedException();
	}
}
