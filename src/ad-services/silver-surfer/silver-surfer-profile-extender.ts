enum InteractionType {
	WIKI_CONTENT = 'wiki content',
	DISCUSSIONS = 'discussions',
}

const emptySilverSurferContext: SilverSurferContext = {
	pages: [],
};

export class SilverSurferProfileExtender {
	extend(profile: UserProfile): UserProfile {
		profile.interactions = this.extendInteractions(profile.interactions ?? []);
		return profile;
	}

	getContext(): SilverSurferContext {
		if (!window.SilverSurferSDK || !window.SilverSurferSDK.isInitialized()) {
			console.warn('SilverSurfer SKD not available or not initialised!');
			return emptySilverSurferContext;
		}
		return window.SilverSurferSDK.getContext();
	}

	private extendInteractions(values: string[]): string[] {
		const products = this.getContext().pages.map((page) => page.product);

		if (products.includes('mw') && !values.includes(InteractionType.WIKI_CONTENT)) {
			values.push(InteractionType.WIKI_CONTENT);
		}
		if (products.includes('dis') && !values.includes(InteractionType.DISCUSSIONS)) {
			values.push(InteractionType.DISCUSSIONS);
		}
		return values;
	}
}
