const INTERACTIONS_KEY = 'interactions';

enum InteractionType {
	WIKI_CONTENT = 'wiki content',
	DISCUSSIONS = 'discussions',
}

export default class SilverSurferContextMapper {
	private context: SilverSurferContext = undefined;

	extend(key: string, values: string[]) {
		if (key === INTERACTIONS_KEY) {
			this.extendInteractions(values, this.getContext());
		}
		return values;
	}

	getContext(): SilverSurferContext {
		if (
			this.context === undefined &&
			window.SilverSurferSDK &&
			window.SilverSurferSDK.isInitialized()
		) {
			this.context = window.SilverSurferSDK.getContext();
		}
		return this.context;
	}

	private extendInteractions(values: string[], context: SilverSurferContext): string[] {
		if (!context) {
			return values;
		}
		if (values === undefined) {
			values = [];
		}
		const products = context.pages.map((page) => page.product);

		if (products.includes('mw') && !values.includes(InteractionType.WIKI_CONTENT)) {
			values.push(InteractionType.WIKI_CONTENT);
		}
		if (products.includes('dis') && !values.includes(InteractionType.DISCUSSIONS)) {
			values.push(InteractionType.DISCUSSIONS);
		}
		return values;
	}
}
