import { VideoData } from '@ad-engine/core';
import { JWPlayerEventKey } from '../external-types/jwplayer';
import { JwpEvent } from '../streams/jwplayer-streams';

export class JwplayerTrackingHelper {
	track<T extends JWPlayerEventKey>(event: JwpEvent<T>): void {
		const tmp: VideoData = {
			ad_error_code: this.getErrorCode(event as any),
		};
	}

	private getErrorCode(event: JwpEvent<'adError'>): number | undefined {
		if (event.eventName !== 'adError') {
			return;
		}

		return event.event && event.event.code;
	}
}
