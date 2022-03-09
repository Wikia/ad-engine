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

type AdTagKey = 'age' | 'esrb' | 'gnre' | 'media' | 'pform' | 'pub' | 'sex' | 'theme' | 'tv';

type AdTags = Partial<Record<AdTagKey, Record<string, number>>>;

type ProductName = 'mw' | 'dis';

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
	pages: PageLevelContext[];
}

interface PageLevelContext {
	product: ProductName;
}

interface GalactusUserProfile {
	profileId: string;
	adTags: AdTags;
}
