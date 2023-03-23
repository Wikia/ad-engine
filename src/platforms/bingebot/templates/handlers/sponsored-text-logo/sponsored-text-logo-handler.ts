import { AdSlot, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { inject, injectable } from 'tsyringe';
import { sponsoredTextLogoComponent } from './sponsored-text-logo-component';
import { SponsoredTextLogoParams } from './sponsored-text-logo-params';

@injectable()
export class SponsoredTextLogoHandler implements TemplateStateHandler {
	private domParser = new DOMParser();

	constructor(
		@inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@inject(TEMPLATE.PARAMS) private params: SponsoredTextLogoParams,
	) {}

	async onEnter(): Promise<void> {
		const components = this.parse(sponsoredTextLogoComponent(this.params));

		this.adSlot.addClass('sponsored-text-logo');
		this.adSlot.getElement().prepend(...components);
	}

	private parse(domstring: string): ChildNode[] {
		const html = this.domParser.parseFromString(domstring, 'text/html');

		return Array.from(html.body.childNodes);
	}
}
