import { JwPlayerAdsFactoryOptions, VideoTargeting } from '../jwplayer-ads-factory';

export interface JWPlayerPayload {
	autostart: boolean; // from config
	mute: boolean; // from getMute
}

export interface JWPlayerBeforePlayPayload {
	mediaid: string; // from playlist item
}

export interface SetupJWPlayerAction {
	type: '[JWPlayer] setup player';
	payload: JwPlayerAdsFactoryOptions;
}

export interface JWPlayerReadyAction {
	type: '[JWPlayer] player ready';
	payload: VideoTargeting;
}
