export interface F2State {
	ads: Ads;
	config: Config;
	endpoints: Endpoints;
	pageType: string;
	user: User;
	regions: Regions;
	comscore: Comscore;
	quantcastUrl: string;
	feed: Feed;
	trackingOptIn: TrackingOptIn;
	googleAnalytics: F2StateGoogleAnalytics;
}

export interface Ads {
	adStack: any[];
	runtime: any[];
}

export interface Comscore {
	id: string;
	keyword: string;
	url: string;
}

export interface Config {
	environment: Environment;
	assetPath: string;
	tracking: Tracking;
	dsSpriteFile: string;
	cookieDomain: string;
}

export interface Environment {
	debug: boolean;
	env: string;
	locale: string;
	siteType: string;
}

export interface Tracking {
	googleAnalytics: TrackingGoogleAnalytics;
	dataWarehouse: DataWarehouse;
	simpleReach: SimpleReach;
}

export interface DataWarehouse {
	routes: Routes;
	wikiId: number;
}

export interface Routes {
	adRenderEndedEvent: string;
	adPageInfoPropEvent: string;
	adVideoEvent: string;
	adViewabilityEvent: string;
	event: string;
	videoEvent: string;
	pageView: string;
}

export interface TrackingGoogleAnalytics {
	accounts: Accounts;
}

export interface Accounts {
	production: Development[];
	development: Development[];
}

export interface Development {
	id: string;
	name: string;
	sampleRate: number;
}

export interface SimpleReach {
	pid: PID;
}

export interface PID {
	production: string;
	development: string;
}

export interface Endpoints {
	getVideoPlaylist: string;
	getKibanaLog: string;
}

export interface Feed {
	hotContentModuleUrl: string;
}

export interface F2StateGoogleAnalytics {
	activeTrackerNames: string[];
}

export interface Regions {
	AU: string;
	UK: string;
	US: string;
}

export interface TrackingOptIn {
	gdpr: Gdpr;
	ccpa: Ccpa;
}

export interface Ccpa {
	options: CcpaOptions;
	uspapiCommands: null[];
	explicit_notice: string;
	lspa_support: string;
	opt_out_sale: string;
	userSignal: string;
}

export interface CcpaOptions {
	cookieAttributes: CookieAttributes;
	ccpaApplies: boolean;
	isSubjectToCcpa: boolean;
}

export interface CookieAttributes {
	domain: string;
	expires: number;
}

export interface Gdpr {
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

export interface ConsentManagementProvider {
	mounted: boolean;
	options: ConsentManagementProviderOptions;
	vendorList: VendorList;
	vendorConsent: VendorConsent;
	cmpCommands: null[];
}

export interface ConsentManagementProviderOptions {
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

export interface VendorConsent {
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

export interface VendorList {
	vendorListVersion: number;
	lastUpdated: Date;
	purposes: Feature[];
	features: Feature[];
	vendors: Vendor[];
}

export interface Feature {
	id: number;
	name: string;
	description: string;
}

export interface Vendor {
	id: number;
	name: string;
	purposeIds: number[];
	legIntPurposeIds: number[];
	featureIds: number[];
	policyUrl: string;
	deletedDate?: Date;
}

export interface ContentManager {
	content: Content;
}

export interface Content {
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

export interface GeoManager {
	geosRequiringPrompt: string[];
	country: string;
	region: string;
}

export interface Location {
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

export interface OptInManager {
	cookieName: string;
	acceptExpiration: number;
	rejectExpiration: number;
	domain: string;
	queryParam: string;
	vendorIds: any[];
	purposeIds: any[];
}

export interface GdprOptions {
	preventScrollOn: string;
	zIndex: number;
	enabledVendorPurposes: number[];
	enabledVendors: number[];
	disableConsentQueue: boolean;
}

export interface Tracker {
	enable: boolean;
	defaultParams: DefaultParams;
}

export interface DefaultParams {
	lang_code: string;
	detected_geo: string;
	beacon: string;
}

export interface User {
	region: string;
}
