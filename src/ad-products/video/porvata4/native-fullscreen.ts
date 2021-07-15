import { utils } from '@ad-engine/core';

export class NativeFullscreen {
	readonly enter: () => boolean | undefined;
	readonly exit: () => boolean | undefined;

	private readonly fullscreenChangeEvent;
	private fullscreen = false;

	constructor(element: HTMLElement) {
		const video = element.querySelector('video');

		this.enter = utils.tryProperty(video, [
			'webkitRequestFullscreen',
			'webkitEnterFullscreen',
			'mozRequestFullScreen',
			'msRequestFullscreen',
			'requestFullscreen',
		]);
		this.exit = utils.tryProperty(video, [
			'webkitExitFullscreen',
			'mozCancelFullScreen',
			'msExitFullscreen',
			'exitFullscreen',
		]);
		this.fullscreenChangeEvent = (
			utils.whichProperty(video, [
				'onwebkitfullscreenchange',
				'onmozfullscreenchange',
				'onmsfullscreenchange',
				'onfullscreenchange',
			]) || ''
		)
			.replace(/^on/, '')
			.replace('msfullscreenchange', 'MSFullscreenChange');

		if (this.isSupported()) {
			this.addChangeListener(() => {
				this.fullscreen = !this.fullscreen;
			});
		}
	}

	addChangeListener(listener: () => void): void {
		document.addEventListener(this.fullscreenChangeEvent, listener);
	}

	removeChangeListener(listener: () => void): void {
		document.removeEventListener(this.fullscreenChangeEvent, listener);
	}

	toggle(): void {
		if (this.isSupported()) {
			if (this.isFullscreen()) {
				this.exit();
			} else {
				this.enter();
			}
		}
	}

	isFullscreen(): boolean {
		return this.fullscreen;
	}

	isSupported(): boolean {
		return Boolean(this.enter && this.exit);
	}
}
