enum AdsManagerLoadedEventType {
	ADS_MANAGER_LOADED,
}
enum AdEventType {
	LOADED,
}
enum AdErrorEventType {
	AD_ERROR,
}

class AdsLoader {
	addEventListener() {}
	contentComplete() {}
	removeEventListener() {}
	requestAds() {}

	getSettings() {
		return {
			setVpaidMode: () => {},
		};
	}
}

export function getIma(): typeof google.ima {
	return {
		// tslint:disable-next-line
		AdDisplayContainer: function() {
			return this;
		},
		// tslint:disable-next-line
		AdsLoader,
		// tslint:disable-next-line
		AdsRequest: function() {},
		AdsManagerLoadedEvent: {
			Type: AdsManagerLoadedEventType,
		},
		AdEvent: {
			Type: AdEventType,
		},
		AdErrorEvent: {
			Type: AdErrorEventType,
		},
		ViewMode: {
			Normal: 0,
		},
	} as any;
}
