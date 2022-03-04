interface SilverSurferSDK {
	isInitialized: () => boolean;
	getContext: () => SilverSurferContext;
	getUserProfile: () => Promise<UserProfile>;
	getGalactusUserProfile: (beacon?: string) => Promise<GalactusUserProfile>;
	registerClient: (client: SilverSurferClient) => Promise<boolean>;
}

interface SilverSurferClient {
	name: string;
}

type SlotStatus = 'loaded' | 'collapsed' | 'unknown';

type AdTagKey = 'age' | 'esrb' | 'gnre' | 'media' | 'pform' | 'pub' | 'sex' | 'theme' | 'tv';

type AdTags = Partial<Record<AdTagKey, Record<string, number>>>;
type FlatAdTags = Partial<Record<AdTagKey, Array<string>>>;

type ProductName = 'mw' | 'dis';
type MwVariant = 'gamepedia' | 'mobile-wiki' | 'oasis';

interface UserProfile {
	beaconId: string;
	gender: string[];
	ageBrackets: string[];
	adTags: AdTags;
	time: number;
	interactions?: string[];
}

interface Action {
	label: string;
}

interface SilverSurferContext {
	current: PageLevelContext;
	pages: PageLevelContext[];
	slots: {
		uap: SlotStatus;
		floorAdhesion: SlotStatus;
		topLeaderboard: SlotStatus;
		hiviLeaderboard: SlotStatus;
		topBoxad: SlotStatus;
	};
	user?: UserLevelContext;
}

interface PageLevelContext {
	product: ProductName;
	productVariant?: MwVariant | string;
	productCategory?: string;
	productId: string;
	page?: string;
	pageId?: string;
	pageLanguage?: string;
	adTags?: FlatAdTags;
	time: number;
}

interface UserLevelContext {
	id: string;
	lang?: string;
	anon?: boolean;
}

interface GalactusUserProfile {
	profileId: string;
	adTags: AdTags;
}
