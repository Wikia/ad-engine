import { AdSlot, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { sponsoredLogoComponent } from './sponsored-logo-component';
import { SponsoredLogoParams } from './sponsored-logo-params';

@Injectable({ autobind: false })
export class SponsoredLogoHandler implements TemplateStateHandler {
	private domParser = new DOMParser();

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: SponsoredLogoParams,
	) {}

	async onEnter(): Promise<void> {
		const component = this.parse(sponsoredLogoComponent(this.params));

		this.adSlot.addClass('sponsored-logo');
		this.adSlot.getElement().prepend(component);
	}

	private parse(domstring: string): ChildNode {
		const html = this.domParser.parseFromString(domstring, 'text/html');

		return html.body.firstChild;
	}
}
