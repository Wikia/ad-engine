import { AdSlot, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { sponsoredLogoComponent } from './sponsored-logo-component';

@Injectable({ autobind: false })
export class SponsoredLogoHandler implements TemplateStateHandler {
	private domParser = new DOMParser();

	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

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
