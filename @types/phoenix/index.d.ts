interface Phoenix {
	hasAds: () => boolean;
	userLoggedIn: () => boolean;
	Events: {
		trigger: (eventName: string) => unknown;
	};
}
