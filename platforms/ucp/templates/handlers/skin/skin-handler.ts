import { TEMPLATE, TemplateStateHandler, utils } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { SkinParams } from './skin-params';

@Injectable({ autobind: false })
export class SkinHandler implements TemplateStateHandler {
	private adSkin?: HTMLElement;

	constructor(
		@Inject(TEMPLATE.NAME) private name: string,
		@Inject(TEMPLATE.PARAMS) private params: SkinParams,
	) {
		this.ensureParams();
	}

	private ensureParams(): void {
		this.params.pixels = (this.params.pixels || []).filter((pixelUrl) => !!pixelUrl);
		this.params.backgroundColor = this.removeColorHash(this.params.backgroundColor);
		this.params.middleColor = this.removeColorHash(
			this.params.middleColor ?? this.params.backgroundColor,
		);
	}

	private removeColorHash(color: string = ''): string {
		return color.replace('#', '');
	}

	async onEnter(): Promise<void> {
		this.adSkin = this.createAdSkin();
	}

	private createAdSkin(): HTMLElement {
		const parent = document.querySelector('.WikiaSiteWrapper');
		const adSkin = document.createElement('div');

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
		this.triggerPixels(adSkin);

		return parent.appendChild(adSkin);
	}

	private triggerPixels(parentNode: HTMLElement): void {
		this.params.pixels.forEach((pixelUrl) => {
			const pixelElement = document.createElement('img');

			utils.logger(`${this.name}-template`, 'adding tracking pixel ', pixelUrl);
			pixelElement.src = pixelUrl;
			pixelElement.width = 1;
			pixelElement.height = 1;
			parentNode.appendChild(pixelElement);
		});
	}

	async onLeave(): Promise<void> {
		this.adSkin?.remove();
	}
}
