import { TEMPLATE, TemplateStateHandler, utils } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { BackgroundOptions } from '../../helpers/background-changer';
import { DomManipulator } from '../../helpers/manipulators/dom-manipulator';
import { SkinParams } from './skin-params';

@Injectable({ autobind: false })
export class SkinHandler implements TemplateStateHandler {
	constructor(
		@Inject(TEMPLATE.NAME) private name: string,
		@Inject(TEMPLATE.PARAMS) private params: SkinParams,
		private manipulator: DomManipulator,
	) {
		this.ensureParams();
	}

	private ensureParams(): void {
		this.params.pixels = this.params.pixels || [];
		this.params.backgroundColor = this.removeColorHash(this.params.backgroundColor);
		this.params.middleColor = this.removeColorHash(
			this.params.middleColor ?? this.params.backgroundColor,
		);
	}

	private removeColorHash(color: string = ''): string {
		return color.replace('#', '');
	}

	async onEnter(): Promise<void> {
		const adSkin = this.createAdSkin();

		this.manipulator.element(adSkin).setProperty('display', 'inline');
		this.manipulator.element(document.body).addClass('has-background-ad');

		console.log('**', this.params);
	}

	private getBackgroundOptions(): BackgroundOptions {
		return {
			skinImage: this.params.skinImage,
			skinImageWidth: 1700,
			skinImageHeight: 800,
			backgroundColor: `#${this.params.backgroundColor}`,
			backgroundMiddleColor: `#${this.params.middleColor}`,
			ten64: this.params.ten64,
		};
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
		adSkin.style.background = `url("${this.params.skinImage}") no-repeat top center #${this.params.backgroundColor}`;
		adSkin.addEventListener('click', () => {
			utils.logger(`${this.name}-template`, 'click');
			window.open(this.params.destUrl);
		});
		parent.appendChild(adSkin);

		return adSkin;
	}

	async onLeave(): Promise<void> {}
}
