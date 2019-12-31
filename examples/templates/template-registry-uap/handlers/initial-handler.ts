import {
	resolvedState,
	setupNavbar,
	slotTweaker,
	TemplateAdSlot,
	TemplateParams,
	TemplateStateHandler,
	TemplateTransition,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { AdvertisementLabel } from '../../../../src/ad-products/templates/interface/advertisement-label';
import { HandlersShared } from '../helpers/handlers-shared';

@Injectable()
export class InitialHandler implements TemplateStateHandler {
	constructor(
		private params: TemplateParams,
		private slot: TemplateAdSlot,
		private shared: HandlersShared,
	) {}

	async onEnter(transition: TemplateTransition<'impact' | 'resolved' | 'sticky'>): Promise<void> {
		this.init(transition);
		this.shared.startStickiness(this.slot);
	}

	async onLeave(): Promise<void> {}

	init(transition: TemplateTransition<'impact' | 'resolved'>): void {
		if (!this.slot.getElement()) {
			return;
		}

		this.slot.setConfigProperty('showManually', true);
		this.slot.hide();

		universalAdPackage.init(
			this.params as any,
			this.shared.config.slotsToEnable,
			this.shared.config.slotsToDisable,
		);

		this.slot.getElement().style.backgroundColor = this.getBackgroundColor();
		this.slot.getElement().classList.add('bfaa-template');

		this.adIsReady().then((iframe: HTMLIFrameElement) => this.onAdReady(iframe, transition));

		this.shared.config.onInit(this.slot, this.params as any, this.shared.config);
	}

	private getBackgroundColor(): string {
		const color = `#${this.params.backgroundColor.replace('#', '')}`;

		return this.params.backgroundColor ? color : '#000';
	}

	private async adIsReady(): Promise<HTMLIFrameElement | HTMLElement> {
		this.shared.readyElement = await slotTweaker.onReady(this.slot);

		return this.shared.readyElement;
	}

	private async onAdReady(
		iframe: HTMLIFrameElement,
		transition: TemplateTransition<'impact' | 'resolved'>,
	): Promise<void> {
		this.shared.config.mainContainer.style.paddingTop = iframe.parentElement.style.paddingBottom;
		this.shared.config.mainContainer.classList.add('has-bfaa');

		// Ad has to be shown after iframe is ready (and slot is expanded to responsive)
		// However it has to be visible before adjusting navbar position...
		this.slot.show();

		setupNavbar(this.shared.config, this.slot.getElement());

		if (document.hidden) {
			await utils.once(window, 'visibilitychange');
		}

		this.themeOnAdReady(transition);
	}

	private themeOnAdReady(transition: TemplateTransition<'impact' | 'resolved'>): void {
		this.slot.addClass('theme-hivi');
		this.addAdvertisementLabel();

		resolvedState.isResolvedState(this.params) ? transition('resolved') : transition('impact');
	}

	private addAdvertisementLabel(): void {
		const advertisementLabel = new AdvertisementLabel();

		this.slot.getElement().appendChild(advertisementLabel.render());
	}
}
