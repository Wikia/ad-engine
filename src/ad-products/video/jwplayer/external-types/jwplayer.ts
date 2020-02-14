import { JWPlayerConfig } from './jwplayer-config';
import { JWPlayerEvent } from './jwplayer-event';
import { JWPlayerListItem } from './jwplayer-list-item';

export interface AdProgressParam {
	client: 'vast' | 'googima';
	creativetype: string;
	tag: string;
}

export interface AdCompanionsParam {
	companions: any[];
	tag: string;
}

export interface AdErrorParam {
	message: string;
	adErrorCode?: number;
}

export interface AdRequestParam {
	adposition: 'pre' | 'mid' | 'post';
	client: 'vast' | 'googima';
	offset: 'pre' | 'mid' | 'post';
	tag: string;
}

export interface AdImpressionParam {
	adposition: 'pre' | 'mid' | 'post';
	adsystem: string;
	adtitle: string;
	clickThroughUrl: string;
	client: 'vast' | 'googima';
	creativetype: string;
	linear: string;
	mediafile: any;
	tag: string;
	vastversion: number;
	wrapper: any[];
}

export interface AdScheduleParam {
	tag: string;
	client: string;
	adbreaks: object[];
}

export interface AdStartedParam {
	creativetype: string;
	tag: string;
}

export interface AdPlayParam {
	creativetype: string;
	newstate: string;
	oldstate: string;
	tag: string;
}

export interface BufferParam {
	newstate: string;
	oldstate: string;
	reason: 'loading' | 'complete' | 'stalled' | 'error';
}

export interface BufferChangeParam {
	duration: number;
	bufferPercent: number;
	position: number;
	metadata: any;
}

export interface AdTimeParam {
	client: 'vast' | 'googima';
	creativetype: string;
	duration: number;
	position: number;
	sequence: number;
	tag: string;
}

export interface AdsManagerParam {
	adsManager: google.ima.AdsManager;
	videoElement: HTMLElement;
}

export interface AudioTracksParam {
	levels: any[];
}

export interface CaptionsChangedParam {
	currentTrack: number;
}

export interface CaptionsListParam {
	tracks: any[];
}

export interface AudioTrackChangedParam {
	currentTrack: number;
}

export interface MetadataParam {
	metadata: any;
}

export interface ControlsParam {
	controls: boolean;
}

export interface ErrorParam {
	message: string;
}

export interface FullscreenParam {
	fullscreen: boolean;
}

export interface IdleParam {
	oldstate: 'buffering' | 'playing' | 'paused';
}

export interface LevelsChangedParam {
	currentQuality: number;
}

export interface MuteParam {
	mute: boolean;
}

export interface VolumeParam {
	volume: boolean;
}

export interface PlayParam {
	oldstate: 'buffering' | 'playing';
	viewable: 0 | 1;
}

export interface PlaylistParam {
	playlist: any[];
}

export interface PlaylistItemParam {
	index: number;
	item: any;
}

export interface ReadyParam {
	setupTime: number;
	viewable: 0 | 1;
}

export interface ResizeParam {
	width: number;
	height: number;
}

export interface VisualQualityParam {
	mode: string;
	label: string;
	reason: string;
}

export interface LevelsParam {
	width: number;
	levels: any[];
}

export interface SeekParam {
	position: number;
	offset: number;
}

export interface TimeParam {
	duration: number;
	position: number;
	viewable: 0 | 1;
}

export interface FirstFrameParam {
	loadTime: number;
	viewable: 0 | 1;
}

type EventCallback<T> = (param: T) => void;

export interface CastParam {
	available: boolean;
	active: boolean;
	deviceName: string;
	type: 'cast';
}

export interface JWPlayerEventParams {
	adClick: AdProgressParam;
	adCompanions: AdCompanionsParam;
	adComplete: AdProgressParam;
	adSkipped: AdProgressParam;
	adError: AdErrorParam & JWPlayerEvent & { code: number };
	adRequest: AdRequestParam & JWPlayerEvent;
	adSchedule: AdScheduleParam;
	adStarted: AdStartedParam;
	adImpression: AdImpressionParam & JWPlayerEvent;
	adViewableImpression: JWPlayerEvent;
	adPlay: AdPlayParam;
	adPause: AdPlayParam;
	adTime: AdTimeParam;
	adsManager: AdsManagerParam;
	cast: CastParam;
	meta: MetadataParam;
	audioTracks: AudioTracksParam;
	audioTrackChanged: AudioTrackChangedParam;
	firstFrame: FirstFrameParam;
	buffer: BufferParam;
	bufferChange: BufferChangeParam;
	captionsChanged: CaptionsChangedParam;
	captionsList: CaptionsListParam;
	controls: ControlsParam;
	error: ErrorParam;
	fullscreen: FullscreenParam;
	idle: IdleParam;
	levelsChanged: LevelsChangedParam;
	mute: MuteParam;
	volume: VolumeParam;
	pause: PlayParam;
	play: PlayParam;
	playlist: PlaylistParam;
	playlistItem: PlaylistItemParam;
	ready: ReadyParam;
	resize: ResizeParam;
	visualQuality: VisualQualityParam;
	levels: LevelsParam;
	seek: SeekParam;
	setupError: ErrorParam;
	time: TimeParam;
}

export type JWPlayerNoParamEvent =
	| 'adBlock'
	| 'beforeComplete'
	| 'videoMidPoint'
	| 'complete'
	| 'beforePlay'
	| 'displayClick'
	| 'playlistComplete'
	| 'seeked'
	| 'remove'
	| 'videoStart'
	| 'adFirstQuartile'
	| 'adMidPoint'
	| 'adThirdQuartile';

export interface JWPlayer {
	getMute(): boolean;
	getPlaylist(): JWPlayerListItem[];
	getPlaylistIndex(): number;
	getPlaylistItem(index?: number): JWPlayerListItem;
	getContainer(): HTMLElement;
	on<TEvent extends keyof JWPlayerEventParams>(
		event: TEvent,
		callback: EventCallback<JWPlayerEventParams[TEvent]>,
	): void;
	on(event: JWPlayerNoParamEvent, callback: () => void): void;
	once<TEvent extends keyof JWPlayerEventParams>(
		event: TEvent,
		callback: EventCallback<JWPlayerEventParams[TEvent]>,
	): void;
	once(event: JWPlayerNoParamEvent, callback: () => void): void;
	off(event: keyof JWPlayerEventParams | JWPlayerNoParamEvent): void;
	trigger<TEvent extends keyof JWPlayerEventParams>(
		event: TEvent,
		args: JWPlayerEventParams[TEvent],
	): void;
	trigger(event: JWPlayerNoParamEvent): void;
	pause(state?: boolean): void;
	pauseAd(tag: string): void;
	play(state?: boolean): void;
	playAd(tag: string): void;
	playlistItem(index: number): void;
	setMute(state?: boolean): void;
	stop(): void;
	getConfig(): JWPlayerConfig;
}
