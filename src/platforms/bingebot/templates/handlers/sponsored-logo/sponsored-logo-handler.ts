import { AdSlot, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { inject, injectable } from 'tsyringe';
import { sponsoredLogoComponent } from './sponsored-logo-component';

@injectable()
export class SponsoredLogoHandler implements TemplateStateHandler {
	private domParser = new DOMParser();

	constructor(@inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(): Promise<void> {
		const components = this.parse(sponsoredLogoComponent());

		this.adSlot.addClass('sponsored-logo');
		this.adSlot.getElement().prepend(...components);
	}

	private parse(domstring: string): ChildNode[] {
		const html = this.domParser.parseFromString(domstring, 'text/html');

		return Array.from(html.body.childNodes);
	}
}
