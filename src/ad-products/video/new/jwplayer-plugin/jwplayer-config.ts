export interface JWPlayerConfig {
	autoPause: AutoPause;
	autostart: boolean;
	bandwidthEstimate: number;
	bitrateSelection?: any;
	castAvailable: boolean;
	controls: boolean;
	cues: any[];
	defaultPlaybackRate: number;
	displaydescription: boolean;
	displaytitle: boolean;
	displayPlaybackLabel: boolean;
	enableShortcuts: boolean;
	height: number;
	intl: Intl;
	language: string;
	liveTimeout?: any;
	localization: Localization;
	mute: boolean;
	nextUpDisplay: boolean;
	playbackRateControls: boolean;
	playbackRates: number[];
	renderCaptionsNatively: boolean;
	repeat?: any;
	stretching: string;
	volume: number;
	width: string;
	advertising: Advertising2;
	aspectratio: string;
	flashplayer: string;
	key: string;
	ph: number;
	pid: string;
	preload: string;
	related: Related2;
	sharing: Sharing2;
	skin: Skin;
	stagevideo: boolean;
	ab: Ab;
	description: string;
	image: string;
	playlist: Playlist2[];
	title: string;
	plugins: Plugins;
	base: string;
	playbackRate: number;
	backgroundLoading: boolean;
	edition: string;
	error?: any;
	generateSEOMetadata: boolean;
	__abHlsjsProgressive: boolean;
	id: string;
	setupConfig: SetupConfig;
	audioMode: boolean;
	flashBlocked: boolean;
	item: number;
	itemMeta: Intl;
	playRejected: boolean;
	state: string;
	itemReady: boolean;
	controlsEnabled: boolean;
	feedData: Intl;
	position: number;
	duration: number;
	buffer: number;
	currentTime: number;
}

interface SetupConfig {
	advertising: Advertising2;
	autostart: boolean;
	description: string;
	image: string;
	mute: boolean;
	playlist: Playlist3[];
	title: string;
	localization: I18n;
	plugins: Plugins2;
	related: Related3;
}

interface Related3 {
	autoplaytimer: number;
	file: string;
	oncomplete: string;
	autoplaymessage: string;
}

interface Plugins2 {
	wikiaSettings: WikiaSettings;
	wikiaSharing: WikiaSharing;
	wikiaWatermark: Intl;
}

interface Playlist3 {
	mediaid: string;
	description: string;
	pubdate: number;
	title: string;
	image: string;
	tags: string;
	variations: any[];
	images: Image[];
	tracks: Track2[];
	link: string;
	duration: number;
	sources: Source[];
}

interface Track2 {
	kind: string;
	file: string;
}

interface Plugins {
	wikiaSettings: WikiaSettings;
	wikiaSharing: WikiaSharing;
	wikiaWatermark: Intl;
}

interface WikiaSharing {
	i18n: I18n;
}

interface WikiaSettings {
	showAutoplayToggle: boolean;
	showQuality: boolean;
	showCaptions: boolean;
	autoplay: boolean;
	selectedCaptionsLanguage?: any;
	i18n: I18n;
}

// tslint:disable-next-line:interface-name
interface I18n {
	admessage: string;
	autoplayVideos: string;
	back: string;
	captions: string;
	close: string;
	cuetext: string;
	fullscreen: string;
	next: string;
	nextUp: string;
	nextUpInSeconds: string;
	pause: string;
	play: string;
	playback: string;
	player: string;
	prev: string;
	replay: string;
	settings: string;
	skipmessage: string;
	sharing: string;
	skiptext: string;
	videoQuality: string;
	volume: string;
	watch: string;
}

interface Playlist2 {
	sources: Source[];
	tracks: Track[];
	minDvrWindow: number;
	dvrSeekLimit: number;
	mediaid: string;
	description: string;
	pubdate: number;
	title: string;
	image: string;
	tags: string;
	variations: any[];
	images: Image[];
	link: string;
	duration: number;
}

interface Image {
	src: string;
	type: string;
	width: number;
}

interface Track {
	kind: string;
	default: boolean;
	file: string;
}

interface Source {
	default: boolean;
	type: string;
	file: string;
	label: string;
	mimeType: string;
	preload: string;
	width?: number;
	height?: number;
}

interface Ab {
	clientId: string;
	tests: Tests;
}

interface Tests {
	hlsjsProgressive: HlsjsProgressive[];
	playlist: Playlist[];
}

interface Playlist {
	type: string;
	id: string;
	selection: string;
	variants: Variants2;
	used: boolean;
}

interface Variants2 {
	'84_no_smart_thumbs': number;
}

interface HlsjsProgressive {
	type: string;
	id: string;
	selection: string;
	variants: Variants;
}

interface Variants {
	'105_hlsjsProgressive': number;
	'105_nonProgressive': number;
}

interface Skin {
	controlbar: Controlbar;
	menus: Menus;
	timeslider: Timeslider;
	tooltips: Tooltips;
}

interface Tooltips {
	background: string;
	text: string;
}

interface Timeslider {
	progress: string;
	rail: string;
}

interface Menus {
	background: string;
	text: string;
	textActive: string;
	textactive: string;
}

interface Controlbar {
	background: string;
	icons: string;
	iconsActive: string;
	iconsactive: string;
	text: string;
}

interface Sharing2 {
	sites: string[];
}

interface Related2 {
	autoplaytimer: number;
	file: string;
	oncomplete: string;
	autoplaymessage: string;
	disableRelated: boolean;
	showButton: boolean;
	shouldAutoAdvance: boolean;
}

interface Advertising2 {
	autoplayadsmuted: boolean;
	client: string;
	vpaidcontrols: boolean;
	admessage: string;
	cuetext: string;
	skipmessage: string;
	skiptext: string;
	setLocale: string;
}

interface Localization {
	advertising: Advertising;
	airplay: string;
	audioTracks: string;
	auto: string;
	buffer: string;
	cast: string;
	cc: string;
	close: string;
	errors: Errors;
	exitFullscreen: string;
	fullscreen: string;
	hd: string;
	liveBroadcast: string;
	logo: string;
	mute: string;
	next: string;
	nextUp: string;
	notLive: string;
	off: string;
	pause: string;
	play: string;
	playback: string;
	playbackRates: string;
	player: string;
	poweredBy: string;
	prev: string;
	related: Related;
	replay: string;
	rewind: string;
	settings: string;
	sharing: Sharing;
	slider: string;
	stop: string;
	unmute: string;
	videoInfo: string;
	volume: string;
	volumeSlider: string;
	shortcuts: Shortcuts;
	admessage: string;
	autoplayVideos: string;
	back: string;
	captions: string;
	cuetext: string;
	nextUpInSeconds: string;
	skipmessage: string;
	skiptext: string;
	videoQuality: string;
	watch: string;
}

interface Shortcuts {
	playPause: string;
	volumeToggle: string;
	fullscreenToggle: string;
	seekPercent: string;
	keyboardShortcuts: string;
	increaseVolume: string;
	decreaseVolume: string;
	seekForward: string;
	seekBackward: string;
	spacebar: string;
	captionsToggle: string;
}

interface Sharing {
	'0': string;
	'1': string;
	'2': string;
	'3': string;
	'4': string;
	'5': string;
	'6': string;
	copied: string;
	email: string;
	embed: string;
	heading: string;
	link: string;
}

interface Related {
	autoplaymessage: string;
	heading: string;
}

interface Errors {
	badConnection: string;
	cantLoadPlayer: string;
	cantPlayInBrowser: string;
	cantPlayVideo: string;
	errorCode: string;
	liveStreamDown: string;
	protectedContent: string;
	technicalError: string;
}

interface Advertising {
	admessage: string;
	cuetext: string;
	displayHeading: string;
	loadingAd: string;
	podmessage: string;
	skipmessage: string;
	skiptext: string;
}

type Intl = any;

interface AutoPause {
	viewability: boolean;
	pauseAds: boolean;
}
