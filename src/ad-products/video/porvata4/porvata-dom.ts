import { vastDebugger } from '@ad-engine/core';

export class PorvataDom {
	private readonly interfaceContainer: HTMLElement;
	private readonly videoContainer: HTMLElement | undefined;
	private readonly videoElement: HTMLVideoElement | undefined;

	constructor(private readonly playerContainer: HTMLElement) {
		this.videoContainer = playerContainer.querySelector('div');
		this.videoElement = this.videoContainer.querySelector('video');
		this.interfaceContainer = document.createElement('div');

		this.playerContainer.classList.add('porvata', 'porvata-container');
		this.videoContainer.classList.add('video-player', 'porvata-player', 'hide');
		this.videoElement.classList.add('porvata-video');
		this.interfaceContainer.classList.add('porvata-interface', 'hide');

		this.playerContainer.appendChild(this.interfaceContainer);
	}

	getInterfaceContainer(): HTMLElement {
		return this.interfaceContainer;
	}

	getPlayerContainer(): HTMLElement | undefined {
		return this.playerContainer;
	}

	getVideoContainer(): HTMLElement | undefined {
		return this.videoContainer;
	}

	getVideoElement(): HTMLVideoElement | undefined {
		return this.videoElement;
	}

	setAttribute(key: string, value: string) {
		this.playerContainer.setAttribute(key, value);
	}

	setVastAttributes(adTagUrl: string, status: string, currentAd?: google.ima.Ad): void {
		const attributes = vastDebugger.getVastAttributes(adTagUrl, status, currentAd);

		Object.keys(attributes).forEach((key) => this.setAttribute(key, attributes[key]));
	}

	setAutoPlayOnVideoElement(value: boolean): void {
		if (this.videoElement) {
			this.videoElement.autoplay = value;
			this.videoElement.muted = value;
		}
	}

	setAudioOnVideoElement(volume: number): void {
		if (this.videoElement) {
			this.videoElement.muted = volume === 0;
			this.videoElement.volume = volume;
		}
	}
}
