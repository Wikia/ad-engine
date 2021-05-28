import { globalAction } from '@ad-engine/communication';
import { props } from 'ts-action';

export interface VideoTargeting {
	plist?: string;
	vtags?: string;
}

export interface JwPlayerAdsFactoryOptions {
	audio: boolean;
	ctp: boolean;
	featured: boolean;
	slotName: string;
	videoId: string;
}

export const jwpReady = globalAction(
	'[JWPlayer] Player Ready',
	props<{ options: JwPlayerAdsFactoryOptions; targeting: VideoTargeting; playerKey: string }>(),
);

export const jwpSetup = globalAction(
	'[Ad Engine] Setup JWPlayer',
	props<{ showAds: boolean; autoplayDisabled: boolean }>(),
);
