interface MediaWiki {
	config: {
		values: {};
	};

	loader: {
		using: (input: string) => Promise<void>;
	};

	hook(eventName: string): Hook;
}

/**
 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.hook
 */
interface Hook {
	add(handler: () => void): void;

	fire(data: any): void;

	remove(handler: () => void): void;
}
