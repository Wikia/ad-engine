interface SilverSurferSDK {
	isInitialized: () => boolean;
	getRealtimeContext: () => RealtimeContext;
	getLocalContext: () => Promise<LocalContext>;
	getUserProfile: () => Promise<UserProfile>;
	getGalactusUserProfile: (beacon?: string) => Promise<GalactusUserProfile>;
	registerClient: (client: SilverSurferClient) => Promise<boolean>;
}

interface SilverSurferClient {
	name: string;
}

type SlotStatus = 'loaded' | 'collapsed' | 'unknown';

interface RealtimeContext {
	slots: {
		uap: SlotStatus;
		floorAdhesion: SlotStatus;
	};
}

type AdTagKey = 'age' | 'esrb' | 'gnre' | 'media' | 'pform' | 'pub' | 'sex' | 'theme' | 'tv';

type AdTags = Partial<Record<AdTagKey, Record<string, number>>>;

interface Page {
	id: number;
	communityId: number;
	vertical: string;
	adTags: AdTags;
}

export interface UserProfile {
	beaconId: string;
	gender: string[];
	ageBrackets: string[];
	adTags: AdTags;
	time: number;
}

interface Action {
	label: string;
}

interface LocalContext {
	communityId: number;
	pageId: number;
	vertical: string;
	adTags: AdTags;
	pages: Page[];
	actions: Action[];
	recentTVCommunities: RecentTVCommunity[];
}

interface GalactusUserProfile {
	profileId: string;
	adTags: AdTags;
}

interface RecentTVCommunity {
	communityId: string;
	pageViews: number;
}
