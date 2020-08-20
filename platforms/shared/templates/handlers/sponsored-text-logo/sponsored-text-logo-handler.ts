import { AdSlot, TEMPLATE, TemplateDependency, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import {
	sponsoredTextLogoComponent,
	SponsoredTextLogoComponentConfig,
} from './sponsored-text-logo-component';
import { SponsoredTextLogoParams } from './sponsored-text-logo-params';

const CONFIG = Symbol('Line Color');

@Injectable({ autobind: false })
export class SponsoredTextLogoHandler implements TemplateStateHandler {
	static config(
		config: SponsoredTextLogoComponentConfig,
	): TemplateDependency<SponsoredTextLogoComponentConfig> {
		return {
			bind: CONFIG,
			value: config,
		};
	}

	private domParser = new DOMParser();

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: SponsoredTextLogoParams,
		@Inject(CONFIG) private config: SponsoredTextLogoComponentConfig,
	) {}

	async onEnter(): Promise<void> {
		const components = this.parse(sponsoredTextLogoComponent(this.params, this.config));

		this.adSlot.addClass('sponsored-text-logo');
		this.adSlot.getElement().prepend(...components);
	}

	private parse(domstring: string): ChildNode[] {
		const html = this.domParser.parseFromString(domstring, 'text/html');

		return Array.from(html.body.childNodes);
	}
}
