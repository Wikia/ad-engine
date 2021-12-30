import { communicationService, eventsRepository } from '@ad-engine/communication';
import { Injectable } from '@wikia/dependency-injection';

interface EventAdInfo {
	adId: string;
	adSystem: string;
	advertiserName: string;
	creativeId: string;
	dealId: string;
	description: string;
	duration: number;
	minSuggestedDuration: number;
	title: string;
	universalAdIdValue: string;
	universalAdIdRegistry: string;
}

interface EventVideoInfo {
	description: string;
	duration: number;
	mediaid: string;
	title: string;
	pubdate: Date;
	tags: string;
}

interface VideoEvent {
	name: string;
	payload: {
		adPlayId: string;
		ima: {
			ad: {
				h: EventAdInfo;
			};
		};
	};
	state: {
		playlistItem: EventVideoInfo;
	};
}

interface VideoEventSchema {
	ad: {
		ad_id: string;
		ad_system: string;
		advertiser_name: string;
		creative_id: string;
		deal_id: string;
		description: string;
		duration: number;
		min_suggested_duration: number;
		title: string;
		universal_ad_id: string;
		universal_ad_id_registry: string;
	};
	video: {
		description: string;
		duration: number;
		video_id: string;
		name: string;
		tags: string[];
	};
	play_id: string;
	progress?: number;
}

@Injectable()
export class VideoTracker {
	private adInfo: EventAdInfo;
	private playId: string;

	private getEventName(videoEvent: VideoEvent): string {
		const videoAdEventsMap = {
			adStarted: 'VideoAdPlay',
			adFirstQuartile: 'VideoAdProgress',
			adMidPoint: 'VideoAdProgress',
			adThirdQuartile: 'VideoAdProgress',
			adComplete: 'VideoAdProgress',
			adClick: 'VideoAdClick',
		};

		return videoAdEventsMap[videoEvent.name];
	}

	private getVideoAdProgress(videoEvent: VideoEvent): number {
		const videoAdProgressMap = {
			adFirstQuartile: 0.25,
			adMidPoint: 0.5,
			adThirdQuartile: 0.75,
			adComplete: 1.0,
		};

		return videoAdProgressMap[videoEvent.name];
	}

	private getVideoEventSchema(videoEvent: VideoEvent): VideoEventSchema {
		// INFO: ima and adPlayId are present only in adStarted and adClick events
		// so we have to save it for the rest of ad events (e.g. process)
		if (this.getEventName(videoEvent) === 'VideoAdPlay') {
			this.adInfo = videoEvent.payload.ima.ad.h;
			this.playId = videoEvent.payload.adPlayId;
		}
		const videoInfo = videoEvent.state.playlistItem;
		const event = {
			ad: {
				ad_id: this.adInfo.adId,
				ad_system: this.adInfo.adSystem,
				advertiser_name: this.adInfo.advertiserName,
				creative_id: this.adInfo.creativeId,
				deal_id: this.adInfo.dealId,
				description: this.adInfo.description,
				duration: this.adInfo.duration,
				min_suggested_duration: this.adInfo.minSuggestedDuration,
				title: this.adInfo.title,
				universal_ad_id: this.adInfo.universalAdIdValue,
				universal_ad_id_registry: this.adInfo.universalAdIdRegistry,
			},
			video: {
				description: videoInfo.description,
				duration: videoInfo.duration,
				video_id: videoInfo.mediaid,
				name: videoInfo.title,
				tags: videoInfo.tags.split(','),
			},
			play_id: this.playId,
		};

		if (this.getEventName(videoEvent) === 'VideoAdProgress') {
			event['progress'] = this.getVideoAdProgress(videoEvent);
		}

		return event;
	}

	setupVideoAdTracking(): void {
		communicationService.listen(
			eventsRepository.VIDEO_EVENT,
			({ videoEvent }) => {
				const videoEventName = this.getEventName(videoEvent);

				if (videoEventName) {
					window.permutive.track(videoEventName, this.getVideoEventSchema(videoEvent), {});
				}
			},
			false,
		);
	}
}
