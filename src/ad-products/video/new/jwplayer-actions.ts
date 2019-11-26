import { action, props } from 'ts-action';
import { JwPlayerAdsFactoryOptions, VideoTargeting } from '../jwplayer-ads-factory';
import { JWPlayerEventParams } from './jwplayer-plugin/jwplayer';

export interface JWPlayerPayload {
	autostart: boolean; // from config
	mute: boolean; // from getMute
}

export interface JWPlayerBeforePlayPayload {
	mediaid: string; // from playlist item
}

export const jwpReady = action(
	'[JWPlayer] player ready',
	props<{ options: JwPlayerAdsFactoryOptions; targeting: VideoTargeting }>(),
);

export const jwpAdError = action(
	'[JWPlayer Internal] adError',
	props<{ event: JWPlayerEventParams['adError'] }>(),
);
