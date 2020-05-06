export interface F2State {
	ads: Ads;
	article?: Article;
	config: Config;
	endpoints: Endpoints;
	pageType: string;
	user: User;
	regions: Regions;
	comscore: Comscore;
	quantcastUrl: string;
	feed: Feed;
	topic?: Topic;
	trackingOptIn: TrackingOptIn;
	googleAnalytics: F2StateGoogleAnalytics;
	hasFeaturedVideo?: boolean;
}

interface Ads {
	adStack: any[];
	runtime: any[];
}

interface Article {
	featuredImage: string;
	id: number;
	slug: string;
	tags: string[];
	topics: ArticleTopic[];
	topicNames: string[];
	publishedTime: Date;
	authorName: string;
	isArticlePlus: boolean;
	contentId: number;
}

interface ArticleTopic {
	id: string;
	name: string;
	topicSlug: string;
	pinned: boolean;
}

interface Topic {
	id: string;
	slug: string;
}

interface Comscore {
	id: string;
	keyword: string;
	url: string;
}

interface Config {
	environment: Environment;
	assetPath: string;
	tracking: Tracking;
	dsSpriteFile: string;
	cookieDomain: string;
}

interface Environment {
	debug: boolean;
	env: string;
	locale: string;
	siteType: string;
}

interface Tracking {
	googleAnalytics: TrackingGoogleAnalytics;
	dataWarehouse: DataWarehouse;
	simpleReach: SimpleReach;
}

interface DataWarehouse {
	routes: Routes;
	wikiId: number;
}

interface Routes {
	adRenderEndedEvent: string;
	adPageInfoPropEvent: string;
	adVideoEvent: string;
	adViewabilityEvent: string;
	event: string;
	videoEvent: string;
	pageView: string;
}

interface TrackingGoogleAnalytics {
	accounts: Accounts;
}

interface Accounts {
	production: Development[];
	development: Development[];
}

interface Development {
	id: string;
	name: string;
	sampleRate: number;
}

interface SimpleReach {
	pid: PID;
}

interface PID {
	production: string;
	development: string;
}

interface Endpoints {
	getVideoPlaylist: string;
	getKibanaLog: string;
}

interface Feed {
	hotContentModuleUrl: string;
}

interface F2StateGoogleAnalytics {
	activeTrackerNames: string[];
}

interface Regions {
	AU: string;
	UK: string;
	US: string;
}

interface TrackingOptIn {
	gdpr: Gdpr;
	ccpa: Ccpa;
}

interface Ccpa {
	options: CcpaOptions;
	uspapiCommands: null[];
	explicit_notice: string;
	lspa_support: string;
	opt_out_sale: string;
	userSignal: string;
}

interface CcpaOptions {
	cookieAttributes: CookieAttributes;
	ccpaApplies: boolean;
	isSubjectToCcpa: boolean;
}

interface CookieAttributes {
	domain: string;
	expires: number;
}

interface Gdpr {
	tracker: Tracker;
	optInManager: OptInManager;
	geoManager: GeoManager;
	contentManager: ContentManager;
	consentManagementProvider: ConsentManagementProvider;
	options: GdprOptions;
	location: Location;
	isReset: boolean;
	root: null;
}

interface ConsentManagementProvider {
	mounted: boolean;
	options: ConsentManagementProviderOptions;
	vendorList: VendorList;
	vendorConsent: VendorConsent;
	cmpCommands: null[];
}

interface ConsentManagementProviderOptions {
	allowedPublisherPurposes: null;
	allowedVendorPurposes: number[];
	allowedVendors: number[];
	cookieAttributes: CookieAttributes;
	disableConsentQueue: boolean;
	gdprApplies: boolean;
	gdprAppliesGlobally: boolean;
	hasGlobalScope: boolean;
	language: string;
	vendorList: null;
}

interface VendorConsent {
	created: Date;
	lastUpdated: Date;
	version: number;
	vendorList: VendorList;
	vendorListVersion: number;
	cmpId: number;
	cmpVersion: number;
	consentScreen: number;
	consentLanguage: string;
	allowedPurposeIds: number[];
	allowedVendorIds: number[];
}

interface VendorList {
	vendorListVersion: number;
	lastUpdated: Date;
	purposes: Feature[];
	features: Feature[];
	vendors: Vendor[];
}

interface Feature {
	id: number;
	name: string;
	description: string;
}

interface Vendor {
	id: number;
	name: string;
	purposeIds: number[];
	legIntPurposeIds: number[];
	featureIds: number[];
	policyUrl: string;
	deletedDate?: Date;
}

interface ContentManager {
	content: Content;
}

interface Content {
	mainHeadline: string;
	mainBody: string[];
	acceptButton: string;
	backButton: string;
	learnMoreButton: string;
	saveButton: string;
	privacyPolicyButton: string;
	partnerListButton: string;
	preferencesHeadline: string;
	preferencesBody: string[];
	purposesHeader: string;
	vendorsHeader: string;
	showPurposeDetailsButton: string;
	hidePurposeDetailsButton: string;
	showVendorDetailsButton: string;
	hideVendorDetailsButton: string;
	findOutMoreButton: string;
	allowedButton: string;
	disallowedButton: string;
	acceptedButton: string;
	rejectedButton: string;
	privacyPolicyLinkButton: string;
	purposesHeading: string;
	purposesLegitimateInterestHeading: string;
	featuresHeading: string;
	privacyPolicyHeading: string;
	purpose1Title: string;
	purpose1Body: string;
	purpose2Title: string;
	purpose2Body: string;
	purpose3Title: string;
	purpose3Body: string;
	purpose4Title: string;
	purpose4Body: string;
	purpose5Title: string;
	purpose5Body: string;
	feature1Title: string;
	feature1Body: string;
	feature2Title: string;
	feature2Body: string;
	feature3Title: string;
	feature3Body: string;
	otherPartnersHeading: string;
	privacyPolicyUrl: string;
	partnerListUrl: string;
}

interface GeoManager {
	geosRequiringPrompt: string[];
	country: string;
	region: string;
}

interface Location {
	href: string;
	ancestorOrigins: DOMStringList;
	origin: string;
	protocol: string;
	host: string;
	hostname: string;
	port: string;
	pathname: string;
	search: string;
	hash: string;
}

interface OptInManager {
	cookieName: string;
	acceptExpiration: number;
	rejectExpiration: number;
	domain: string;
	queryParam: string;
	vendorIds: any[];
	purposeIds: any[];
}

interface GdprOptions {
	preventScrollOn: string;
	zIndex: number;
	enabledVendorPurposes: number[];
	enabledVendors: number[];
	disableConsentQueue: boolean;
}

interface Tracker {
	enable: boolean;
	defaultParams: DefaultParams;
}

interface DefaultParams {
	lang_code: string;
	detected_geo: string;
	beacon: string;
}

interface User {
	region: string;
}
