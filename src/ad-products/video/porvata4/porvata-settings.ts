import { context, Dictionary, Targeting, utils } from '@ad-engine/core';
import { VpaidMode } from './porvata';

export interface PorvataParams extends Dictionary {
	adProduct?: string;
	autoPlay?: boolean;
	container: HTMLElement;
	height?: number;
	iasTracking?: boolean;
	moatTracking?: boolean;
	restartOnUnmute?: boolean;
	slotName: string;
	src: string;
	width?: number;
	vastTargeting?: Targeting;
	vastUrl?: string;
	vpaidMode?: google.ima.ImaSdkSettings.VpaidMode;
}

function getMoatTrackingStatus(params: PorvataParams): boolean {
	const sampling: number = context.get('options.video.moatTracking.sampling');

	if (typeof params.moatTracking === 'boolean') {
		return params.moatTracking;
	}

	if (!context.get('options.video.moatTracking.enabled')) {
		return false;
	}

	if (sampling === 100) {
		return true;
	}

	if (sampling > 0) {
		return utils.sampler.sample('moat_video_tracking', sampling);
	}

	return false;
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
	private readonly moatTracking: boolean;
	private readonly playerContainer: HTMLElement;
	private readonly restartOnMute: boolean;
	private readonly slotName: string;
	private readonly src: string;
	private readonly vastUrl: string | undefined;
	private readonly vastTargeting: Targeting;
	private readonly vpaidMode: google.ima.ImaSdkSettings.VpaidMode;

	constructor(params: PorvataParams) {
		this.adProduct = params.adProduct;
		this.autoPlay = !!params.autoPlay;
		this.height = params.height;
		this.iasTracking = getIasTrackingStatus(params);
		this.moatTracking = getMoatTrackingStatus(params);
		this.playerContainer = params.container;
		this.restartOnMute = !!params.restartOnUnmute;
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

	isMoatTrackingEnabled(): boolean {
		return this.moatTracking;
	}

	isAutoPlay(): boolean | undefined {
		return this.autoPlay;
	}

	setAutoPlay(value: boolean): void {
		this.autoPlay = value;
	}

	getVastTargeting(): Targeting {
		return this.vastTargeting;
	}

	getVastUrl(): string | undefined {
		return this.vastUrl;
	}

	shouldRestartOnMute(): boolean {
		return this.restartOnMute;
	}
}
