import { JWPlayerConfig } from './jwplayer-config';
import { JWPlayerEvent } from './jwplayer-event';
import { JWPlayerListItem } from './jwplayer-list-item';

interface AdProgressParam {
	client: 'vast' | 'googima';
	creativetype: string;
	tag: string;
}

interface AdCompanionsParam {
	companions: any[];
	tag: string;
}

interface AdErrorParam {
	message: string;
	tag: string;
}

interface AdRequestParam {
	adposition: 'pre' | 'mid' | 'post';
	client: 'vast' | 'googima';
	offset: 'pre' | 'mid' | 'post';
	tag: string;
}

interface AdImpressionParam {
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

interface AdScheduleParam {
	tag: string;
	client: string;
	adbreaks: object[];
}

interface AdStartedParam {
	creativetype: string;
	tag: string;
}

interface AdPlayParam {
	creativetype: string;
	newstate: string;
	oldstate: string;
	tag: string;
}

interface BufferParam {
	newstate: string;
	oldstate: string;
	reason: 'loading' | 'complete' | 'stalled' | 'error';
}

interface BufferChangeParam {
	duration: number;
	bufferPercent: number;
	position: number;
	metadata: any;
}

interface AdTimeParam {
	client: 'vast' | 'googima';
	creativetype: string;
	duration: number;
	position: number;
	sequence: number;
	tag: string;
}

interface AdsManagerParam {
	adsManager: unknown;
	videoElement: HTMLElement;
}

interface AudioTracksParam {
	levels: any[];
}

interface CaptionsChangedParam {
	currentTrack: number;
}

interface CaptionsListParam {
	tracks: any[];
}

interface AudioTrackChangedParam {
	currentTrack: number;
}

interface MetadataParam {
	metadata: any;
}

interface ControlsParam {
	controls: boolean;
}

interface ErrorParam {
	message: string;
}

interface FullscreenParam {
	fullscreen: boolean;
}

interface IdleParam {
	oldstate: 'buffering' | 'playing' | 'paused';
}

interface LevelsChangedParam {
	currentQuality: number;
}

interface MuteParam {
	mute: boolean;
}

interface VolumeParam {
	volume: boolean;
}

interface PlayParam {
	oldstate: 'buffering' | 'playing';
	viewable: 0 | 1;
}

interface PlaylistParam {
	playlist: any[];
}

interface PlaylistItemParam {
	index: number;
	item: any;
}

interface ReadyParam {
	setupTime: number;
	viewable: 0 | 1;
}

interface ResizeParam {
	width: number;
	height: number;
}

interface VisualQualityParam {
	mode: string;
	label: string;
	reason: string;
}

interface LevelsParam {
	width: number;
	levels: any[];
}

interface SeekParam {
	position: number;
	offset: number;
}

interface TimeParam {
	duration: number;
	position: number;
	viewable: 0 | 1;
}

interface FirstFrameParam {
	loadTime: number;
	viewable: 0 | 1;
}

type EventCallback<T> = (param: T) => void;

interface CastParam {
	available: boolean;
	active: boolean;
	deviceName: string;
	type: 'cast';
}

interface EventParams {
	adClick: AdProgressParam;
	adCompanions: AdCompanionsParam;
	adComplete: AdProgressParam;
	adSkipped: AdProgressParam;
	adError: AdErrorParam & JWPlayerEvent;
	adRequest: AdRequestParam & JWPlayerEvent;
	adSchedule: AdScheduleParam;
	adStarted: AdStartedParam;
	adImpression: AdImpressionParam & JWPlayerEvent;
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

type NoParamEvent =
	| 'adBlock'
	| 'beforeComplete'
	| 'videoMidPoint'
	| 'complete'
	| 'beforePlay'
	| 'displayClick'
	| 'playlistComplete'
	| 'seeked'
	| 'remove';

export interface JWPlayer {
	getMute(): boolean;
	getPlaylist(): JWPlayerListItem[];
	getPlaylistItem(index?: number): JWPlayerListItem;
	getContainer(): HTMLElement;
	on<TEvent extends keyof EventParams>(
		event: TEvent,
		callback: EventCallback<EventParams[TEvent]>,
	): void;
	on(event: NoParamEvent, callback: () => void): void;
	once<TEvent extends keyof EventParams>(
		event: TEvent,
		callback: EventCallback<EventParams[TEvent]>,
	): void;
	once(event: NoParamEvent, callback: () => void): void;
	off(event: keyof EventParams | NoParamEvent): void;
	trigger<TEvent extends keyof EventParams>(event: TEvent, args: EventParams[TEvent]): void;
	trigger(event: NoParamEvent): void;
	pause(state?: boolean): void;
	pauseAd(tag: string): void;
	play(state?: boolean): void;
	playAd(tag: string): void;
	playlistItem(index: number): void;
	setMute(state?: boolean): void;
	stop(): void;
	getConfig(): JWPlayerConfig;
}
