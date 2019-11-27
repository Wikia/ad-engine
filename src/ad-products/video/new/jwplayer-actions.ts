import { action, props } from 'ts-action';
import { JwPlayerAdsFactoryOptions, VideoTargeting } from '../jwplayer-ads-factory';

export interface JWPlayerPayload {
	autostart: boolean; // from config
	mute: boolean; // from getMute
}

export interface JWPlayerBeforePlayPayload {
	mediaid: string; // from playlist item
}

export const jwpReady = action(
	'[JWPlayer] player ready',
	props<{ options: JwPlayerAdsFactoryOptions; targeting: VideoTargeting; playerKey: string }>(),
);
