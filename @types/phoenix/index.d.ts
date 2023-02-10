interface Phoenix {
	hasAds: () => boolean;
	userLoggedIn: () => boolean;
	Events: {
		trigger: () => unknown;
	};
}
