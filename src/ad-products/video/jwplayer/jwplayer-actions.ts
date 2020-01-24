import { action, props } from 'ts-action';

export interface VideoTargeting {
	plist?: string;
	videoTags?: string | string[]; // not sure about `string`
	v1?: string;
}

export interface JwPlayerAdsFactoryOptions {
	adProduct: string;
	slotName: string;
	audio: boolean;
	autoplay: boolean;
	featured: boolean;
	videoId: string;
}

export const jwpReady = action(
	'[JWPlayer] Player Ready',
	props<{ options: JwPlayerAdsFactoryOptions; targeting: VideoTargeting; playerKey: string }>(),
);
