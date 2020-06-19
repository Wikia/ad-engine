export interface F2State {
	ads?: Ads;
	article?: Article;
	config?: Config;
	endpoints?: Endpoints;
	pageType?: string;
	user?: User;
	regions?: Regions;
	comscore?: Comscore;
	quantcastUrl?: string;
	feed?: Feed;
	topic?: Topic;
	googleAnalytics?: F2StateGoogleAnalytics;
	hasFeaturedVideo?: boolean;
	topOffset?: number;
}

interface Ads {
	adStack?: any[];
	runtime?: any[];
}

interface Article {
	featuredImage?: string;
	id?: number;
	slug?: string;
	tags?: string[];
	topics?: ArticleTopic[];
	topicNames?: string[];
	publishedTime?: Date;
	authorName?: string;
	isArticlePlus?: boolean;
	contentId?: number;
}

interface ArticleTopic {
	id?: string;
	name?: string;
	topicSlug?: string;
	pinned?: boolean;
}

interface Topic {
	id?: string;
	slug?: string;
}

interface Comscore {
	id?: string;
	keyword?: string;
	url?: string;
}

interface Config {
	environment?: Environment;
	assetPath?: string;
	tracking?: Tracking;
	dsSpriteFile?: string;
	cookieDomain?: string;
}

interface Environment {
	debug?: boolean;
	env?: string;
	locale?: string;
	siteType?: string;
}

interface Tracking {
	googleAnalytics?: TrackingGoogleAnalytics;
	dataWarehouse?: DataWarehouse;
	simpleReach?: SimpleReach;
}

interface DataWarehouse {
	routes?: Routes;
	wikiId?: number;
}

interface Routes {
	adRenderEndedEvent?: string;
	adPageInfoPropEvent?: string;
	adVideoEvent?: string;
	adViewabilityEvent?: string;
	event?: string;
	videoEvent?: string;
	pageView?: string;
}

interface TrackingGoogleAnalytics {
	accounts?: Accounts;
}

interface Accounts {
	production?: Development[];
	development?: Development[];
}

interface Development {
	id?: string;
	name?: string;
	sampleRate?: number;
}

interface SimpleReach {
	pid?: PID;
}

interface PID {
	production?: string;
	development?: string;
}

interface Endpoints {
	getVideoPlaylist?: string;
	getKibanaLog?: string;
}

interface Feed {
	hotContentModuleUrl?: string;
}

interface F2StateGoogleAnalytics {
	activeTrackerNames?: string[];
}

interface Regions {
	AU?: string;
	UK?: string;
	US?: string;
}

interface User {
	region?: string;
}
