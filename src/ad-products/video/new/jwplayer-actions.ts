import { JwPlayerAdsFactoryOptions, VideoTargeting } from '../jwplayer-ads-factory';
import { JWPlayerEventParams } from './jwplayer-plugin/jwplayer';

export interface JWPlayerPayload {
	autostart: boolean; // from config
	mute: boolean; // from getMute
}

export interface JWPlayerBeforePlayPayload {
	mediaid: string; // from playlist item
}

export interface JWPlayerReadyAction {
	type: '[JWPlayer] player ready';
	options: JwPlayerAdsFactoryOptions;
	targeting: VideoTargeting;
}

export interface JWPlayerAdErrorAction {
	type: '[JWPlayer Internal] adError';
	event: JWPlayerEventParams['adError'];
}
