import { AdSlot, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { sponsoredTextLogoComponent } from './sponsored-text-logo-component';
import { SponsoredTextLogoParams } from './sponsored-text-logo-params';

@Injectable({ autobind: false })
export class SponsoredTextLogoHandler implements TemplateStateHandler {
	private domParser = new DOMParser();

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: SponsoredTextLogoParams,
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
