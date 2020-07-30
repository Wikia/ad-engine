import { AdSlot } from '@ad-engine/core';
import { JWPlayer } from '../external-types/jwplayer';
import { VideoTargeting } from '../jwplayer-actions';
import { JwpStream } from '../streams/jwplayer-stream';

export interface PlayerReadyResult {
	jwplayer: JWPlayer;
	adSlot: AdSlot;
	targeting: VideoTargeting;
	stream$: JwpStream;
}
