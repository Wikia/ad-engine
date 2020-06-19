import { globalAction } from '@ad-engine/communication';
import { props } from 'ts-action';

export interface VideoTargeting {
	plist?: string;
	videoTags?: string | string[]; // not sure about `string`
	v1?: string; // playlist item id
}

export interface JwPlayerAdsFactoryOptions {
	slotName: string;
	featured: boolean;
}

export const jwpReady = globalAction(
	'[JWPlayer] Player Ready',
	props<{ options: JwPlayerAdsFactoryOptions; targeting: VideoTargeting; playerKey: string }>(),
);

export const jwpSetup = globalAction(
	'[Ad Engine] Setup JWPlayer',
	props<{ showAds: boolean; autoplayDisabled: boolean }>(),
);
