import { context, utils } from '@ad-engine/core';

const logGroup = 'Anyclip';
const isSubscribeReady = () => typeof window['lreSubscribe'] !== 'undefined';

class Anyclip {
	get params(): Record<string, string> {
		return {
			pubname: context.get('services.anyclip.pubname'),
			widgetname: context.get('services.anyclip.widgetname'),
		};
	}

	isEnabled(): boolean {
		return context.get('services.anyclip.enabled');
	}

	call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'Anyclip player is disabled');

			return Promise.resolve();
		}

		this.loadPlayerAsset();
	}

	private loadPlayerAsset() {
		const libraryUrl = 'https://player.anyclip.com/anyclip-widget/lre-widget/prod/v1/src/lre.js';
		const incontentPlayerContainer = document.getElementById('incontent_player');

		utils.logger(logGroup, 'loading Anyclip asset', libraryUrl);

		return utils.scriptLoader
			.loadScript(libraryUrl, 'text/javascript', true, incontentPlayerContainer, this.params)
			.then(() => {
				incontentPlayerContainer.classList.remove('hide');
				utils.logger(logGroup, 'ready');

				this.waitForSubscribeReady().then((isSubscribeReady) => {
					utils.logger(
						logGroup,
						'Anyclip global subscribe function set',
						isSubscribeReady,
						window['lreSubscribe'],
					);
					isSubscribeReady
						? this.setupAnyclipListeners()
						: utils.logger(logGroup, 'Anyclip global subscribe function set');
				});
			});
	}

	private setupAnyclipListeners() {
		const subscribe = window['lreSubscribe'];

		subscribe((data) => console.log('Anyclip WidgetLoad event data: ', data), 'WidgetLoad');
		subscribe((data) => console.log('Anyclip adImpression event data: ', data), 'adImpression');
		subscribe((data) => console.log('Anyclip adSkipped event data: ', data), 'adSkipped');
		subscribe(
			(data) => console.log('Anyclip adFirstQuartile event data: ', data),
			'adFirstQuartile',
		);
		subscribe((data) => console.log('Anyclip adMidpoint event data: ', data), 'adMidpoint');
		subscribe(
			(data) => console.log('Anyclip adThirdQuartile event data: ', data),
			'adThirdQuartile',
		);
		subscribe((data) => console.log('Anyclip adComplete event data: ', data), 'adComplete');
		subscribe((data) => console.log('Anyclip adClick event data: ', data), 'adClick');
	}

	private waitForSubscribeReady(): Promise<boolean> {
		return new utils.WaitFor(isSubscribeReady, 4, 250).until();
	}
}

export const anyclip = new Anyclip();
