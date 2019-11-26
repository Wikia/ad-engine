interface MediaWiki {
	config: {
		values: {};
	};

	loader: {
		/**
		 * @deprecated
		 */
		using: (input: string) => Promise<void>;
		enqueue: (modules: string[], success: () => void, failure?: () => void) => void;
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
