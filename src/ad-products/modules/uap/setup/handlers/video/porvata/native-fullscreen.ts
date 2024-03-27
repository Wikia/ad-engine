// @ts-strict-ignore
import { tryProperty, whichProperty } from "../../../../../../../core/utils";

export class NativeFullscreen {
	readonly enter: () => boolean | undefined;
	readonly exit: () => boolean | undefined;

	static enterEvents = [
		'webkitRequestFullscreen',
		'webkitEnterFullscreen',
		'mozRequestFullScreen',
		'msRequestFullscreen',
		'requestFullscreen',
	];
	static exitEvents = [
		'webkitExitFullscreen',
		'mozCancelFullScreen',
		'msExitFullscreen',
		'exitFullscreen',
	];
	static changeEvents = [
		'onwebkitfullscreenchange',
		'onmozfullscreenchange',
		'onmsfullscreenchange',
		'onfullscreenchange',
	];

	private readonly fullscreenChangeEvent;
	private fullscreen = false;

	constructor(video: HTMLElement) {
		this.enter = tryProperty(video, NativeFullscreen.enterEvents);
		this.exit =
			tryProperty(video, NativeFullscreen.exitEvents) ||
			tryProperty(document, NativeFullscreen.exitEvents);
		this.fullscreenChangeEvent = (whichProperty(video, NativeFullscreen.changeEvents) || '')
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
