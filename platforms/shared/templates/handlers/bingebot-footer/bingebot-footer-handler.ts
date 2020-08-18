import { AdSlot, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { bingebotFooterComponent } from './bingebot-footer-component';
import { BingebotFooterParams } from './bingebot-footer-params';

@Injectable({ autobind: false })
export class BingebotFooterHandler implements TemplateStateHandler {
	private domParser = new DOMParser();

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: BingebotFooterParams,
	) {}

	async onEnter(): Promise<void> {
		const component = this.parse(bingebotFooterComponent(this.params));

		this.adSlot.getElement().appendChild(component);
	}

	private parse(domstring: string): ChildNode {
		const html = this.domParser.parseFromString(domstring, 'text/html');

		return html.body.firstChild;
	}
}
