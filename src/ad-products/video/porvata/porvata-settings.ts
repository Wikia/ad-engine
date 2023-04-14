import { context, Dictionary, SlotTargeting } from '@ad-engine/core';

enum VpaidMode {
	/**
	 * VPAID ads will not play and an error will be returned.
	 */
	DISABLED = 0,
	/**
	 * VPAID ads are enabled using a cross domain iframe. The VPAID ad cannot access the site. VPAID ads that depend on friendly iframe access may error. This is the default.
	 */
	ENABLED = 1,
	/**
	 * VPAID ads are enabled using a friendly iframe. This allows the ad access to the site via JavaScript.
	 */
	INSECURE = 2,
}

export interface PorvataParams extends Dictionary {
	adProduct?: string;
	autoPlay?: boolean;
	container: HTMLElement;
	height?: number;
	iasTracking?: boolean;
	slotName: string;
	src: string;
	type?: string;
	width?: number;
	vastTargeting?: SlotTargeting;
	vastUrl?: string;
	vpaidMode?: google.ima.ImaSdkSettings.VpaidMode;
}

function getIasTrackingStatus(params: PorvataParams): boolean {
	if (typeof params.iasTracking === 'boolean') {
		return params.iasTracking;
	}

	return !!context.get('options.video.iasTracking.enabled');
}

export class PorvataSettings {
	private autoPlay: boolean;
	private height: number;
	private width: number;

	private readonly adProduct: string;
	private readonly iasTracking: boolean;
	private readonly playerContainer: HTMLElement;
	private readonly slotName: string;
	private readonly src: string;
	private readonly vastUrl: string | undefined;
	private readonly vastTargeting: SlotTargeting;
	private readonly vpaidMode: google.ima.ImaSdkSettings.VpaidMode;

	constructor(private params: PorvataParams) {
		this.adProduct = params.adProduct;
		this.autoPlay = !!params.autoPlay;
		this.height = params.height;
		this.iasTracking = getIasTrackingStatus(params);
		this.playerContainer = params.container;
		this.slotName = params.slotName;
		this.src = params.src;
		this.width = params.width;
		this.vastUrl = params.vastUrl;
		this.vastTargeting = params.vastTargeting;
		this.vpaidMode = params.vpaidMode || VpaidMode.ENABLED;
	}

	getAdProduct(): string | undefined {
		return this.adProduct;
	}

	getParams(): PorvataParams {
		return this.params;
	}

	getPlayerContainer(): HTMLElement | undefined {
		return this.playerContainer;
	}

	getSlotName(): string {
		return this.slotName;
	}

	getSrc(): string {
		return this.src;
	}

	getVpaidMode(): google.ima.ImaSdkSettings.VpaidMode {
		return this.vpaidMode;
	}

	getHeight(): number {
		return this.height;
	}

	setHeight(value: number): void {
		this.height = value;
	}

	getWidth(): number {
		return this.width;
	}

	setWidth(value: number): void {
		this.width = value;
	}

	isIasTrackingEnabled(): boolean {
		return this.iasTracking;
	}

	isAutoPlay(): boolean | undefined {
		return this.autoPlay;
	}

	setAutoPlay(value: boolean): void {
		this.autoPlay = value;
	}

	getVastTargeting(): SlotTargeting {
		return this.vastTargeting;
	}

	getVastUrl(): string | undefined {
		return this.vastUrl;
	}
}
