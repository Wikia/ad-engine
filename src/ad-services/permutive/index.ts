import {context, events, eventService, utils} from '@ad-engine/core';

/* tslint:disable */
const PROJECT_ID = '88ca3150-0f6f-482a-bbc1-2aa3276b3cab';
const PUBLIC_API_KEY = '0006e595-b3f2-4dfc-b3a4-657eb42a74cf';
// @ts-ignore
const NAMESPACE = 'fandom';
const logGroup = 'permutive';

interface EventAdInfo {
	adId: string;
	adSystem: string;
	advertiserName: string;
	creativeId: string;
	dealId: string;
	description: string;
	duration: Number;
	minSuggestedDuration: Number;
	title: string;
	universalAdIdValue: string;
	universalAdIdRegistry: string;
}

interface EventVideoInfo {
	description: string;
	duration: Number;
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
				g: EventAdInfo;
			}
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
		duration: Number;
		min_suggested_duration: Number;
		title: string;
		universal_ad_id: string;
		universal_ad_id_registry: string;
	},
	video: {
		description: string;
		duration: Number;
		video_id: string;
		name: string;
		published_at: Date;
		tags: string[];
	},
	play_id: String;
	progress?: Number;
}

class Permutive {
	isSetUp: boolean = false;
	adInfo: EventAdInfo;

	call(): void {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}
		utils.logger(logGroup, 'enabled');
		this.getPermutiveKeysForAppnexus();
		this.setup();
		this.setAddon();
	}

	private isEnabled(): boolean {
		return (
			context.get('services.permutive.enabled') &&
			!context.get('wiki.targeting.directedAtChildren') &&
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale')
		)
	}

	private getPermutiveKeysForAppnexus(): void {
		if (this.isEnabled()) {
			const psegs = JSON.parse(window.localStorage.getItem('_psegs') || '[]')
				.map(Number)
				.filter( segment =>  segment >= 1000000)
				.map(String);
			const ppam = JSON.parse(window.localStorage.getItem('_ppam') || '[]');
			const permutiveKeys = psegs.concat(ppam);
			context.set('bidders.permutiveKeys.appnexus', permutiveKeys);
		}
	}

	private setup(): void {
		if (!this.isSetUp) {
			utils.logger(logGroup, 'loading');
			this.configure();
			this.loadScript();
			this.setTargeting();
			this.isSetUp = true;
		}
	}

	private configure(): void {
		// @ts-ignore
		!function(n,e,o,r,i){if(!e){e=e||{},window.permutive=e,e.q=[],e.config=i||{},e.config.projectId=o,e.config.apiKey=r,e.config.environment=e.config.environment||"production";for(var t=["addon","identify","track","trigger","query","segment","segments","ready","on","once","user","consent"],c=0;c<t.length;c++){var f=t[c];e[f]=function(n){return function(){var o=Array.prototype.slice.call(arguments,0);e.q.push({functionName:n,arguments:o})}}(f)}}}(document,window.permutive,PROJECT_ID,PUBLIC_API_KEY,{});
	}

	private getTargeting(): Array<string> {
		if (window.googletag.pubads) {
			const permutiveGptTargeting = window.googletag.pubads().getTargeting('permutive');

			if (permutiveGptTargeting.length) {
				utils.logger(logGroup, 'gets targeting from GPT', permutiveGptTargeting);

				return permutiveGptTargeting;
			}
		}

		const segments = window.localStorage.getItem('_pdfps');
		let permutiveTargeting = segments ? JSON.parse(segments) : [];
		permutiveTargeting.push('_test');

		utils.logger(logGroup, 'gets targeting from localStorage', permutiveTargeting);

		return permutiveTargeting;
	}

	private setTargeting(): void {
		context.set('targeting.permutive', () => this.getTargeting());
	}

	private loadScript(): Promise<Event> {
		return utils.scriptLoader.loadScript(
			`https://cdn.permutive.com/${PROJECT_ID}-web.js`,
			'text/javascript',
			true,
			'first',
			{ id: 'permutive'},
		);
	}

	private getPageViewEventSchema(): object {
		const pageInfo = {
			's0': context.get('targeting.s0'),
			's1': context.get('targeting.s1'),
			'skin': context.get('targeting.skin'),
			'lang': context.get('targeting.lang'),
			'esrb': context.get('targeting.esrb'),
			'age': context.get('targeting.age'),
			'sex': context.get('targeting.sex'),
			'gnre': context.get('targeting.gnre'),
			'media': context.get('targeting.media'),
			'pform': context.get('targeting.pform'),
			'pub': context.get('targeting.pub'),
			'theme': context.get('targeting.theme'),
			'tv': context.get('targeting.tv'),
			'src': context.get('src'),
			'geo': utils.geoService.getCountryCode(),
		};

		utils.logger(logGroup, 'gets pageview event schema', pageInfo);

		return {
			'page': {
				'page_info': {
					...pageInfo
				},
			}
		}
	}

	private getEventName(videoEvent: VideoEvent): string {
		const videoEventsMap = {
			'adStarted': 'VideoAdPlay',
			'adFirstQuartile': 'VideoAdProgress',
			'adMidPoint': 'VideoAdProgress',
			'adThirdQuartile': 'VideoAdProgress',
			'adComplete': 'VideoAdProgress',
			'adClick': 'VideoAdClick',
		};

		return videoEventsMap[videoEvent.name];
	}

	private getVideoAdProgress(videoEvent: VideoEvent): Number {
		const videoAdProgressMap = {
			'adFirstQuartile': 0.25,
			'adMidPoint': 0.5,
			'adThirdQuartile': 0.75,
			'adComplete': 1.0,
		};

		return videoAdProgressMap[videoEvent.name]
	}

	// TODO add videoPayload type
	private getVideoEventSchema(videoEvent: VideoEvent): VideoEventSchema {
		// INFO: ima is present only in adStarted event so we have to save it
		// for the following ad events (e.g. process)
		this.adInfo = this.adInfo || videoEvent.payload.ima.ad.g;
		const videoInfo = videoEvent.state.playlistItem;
		const event = {
			'ad': {
				'ad_id': this.adInfo.adId,
				'ad_system': this.adInfo.adSystem,
				'advertiser_name': this.adInfo.advertiserName,
				'creative_id': this.adInfo.creativeId,
				'deal_id': this.adInfo.dealId,
				'description': this.adInfo.description,
				'duration': this.adInfo.duration,
				'min_suggested_duration': this.adInfo.minSuggestedDuration,
				'title': this.adInfo.title,
				'universal_ad_id': this.adInfo.universalAdIdValue,
				'universal_ad_id_registry': this.adInfo.universalAdIdRegistry,
			},
			'video': {
				'description': videoInfo.description,
				'duration': videoInfo.duration,
				'video_id': videoInfo.mediaid,
				'name': videoInfo.title,
				'published_at': new Date(videoInfo.pubdate),
				'tags': videoInfo.tags.split(','),
			},
			'play_id': videoEvent.payload.adPlayId,
		};

		if (this.getEventName(videoEvent) === 'VideoAdProgress') {
			event['progress'] = this.getVideoAdProgress(videoEvent);
		}

		return event;
	}

	private setAddon(): void {
		if (window.permutive) {
			window.permutive.addon(
				'web',
				this.getPageViewEventSchema(),
			);

			eventService.on(events.VIDEO_EVENT, (videoEvent) => {
				const videoEventName = this.getEventName(videoEvent);

				if (videoEventName) {
					window.permutive.track(
						videoEventName,
						this.getVideoEventSchema(videoEvent),
						{},
					);
				}
			});
		}
	}
}

export const permutive = new Permutive();
