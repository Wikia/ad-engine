import { TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { DomManipulator } from '../../helpers/manipulators/dom-manipulator';
import { SkinParams } from './skin-params';

@Injectable({ autobind: false })
export class SkinHandler implements TemplateStateHandler {
	constructor(
		@Inject(TEMPLATE.PARAMS) private params: SkinParams,
		private manipulator: DomManipulator,
	) {}

	async onEnter(): Promise<void> {
		const adSkin = this.createAdSkin();

		this.manipulator.element(adSkin).setProperty('display', 'inline');
		this.manipulator.element(document.body).addClass('has-background-ad');

		console.log('**', this.params);
	}

	private createAdSkin(): HTMLElement {
		const parent = document.querySelector('.WikiaSiteWrapper');
		const adSkin = document.createElement('dev');

		adSkin.style.display = 'none';
		adSkin.id = 'ad-skin';
		adSkin.style.position = 'fixed';
		adSkin.style.height = '100%';
		adSkin.style.width = '100%';
		adSkin.style.left = '0';
		adSkin.style.top = '0';
		adSkin.style.cursor = 'pointer';
		parent.appendChild(adSkin);

		return adSkin;
	}

	async onLeave(): Promise<void> {}
}
