interface Window {
	mw: MediaWiki;
}

interface MediaWiki {
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

class VisualEditorEvents {
	ready: Promise<void>;

	constructor() {
		this.ready = new Promise<void>((resolve) => window.RLQ.push(() => resolve()));
	}

	async veActivationComplete(handler: () => void): Promise<void> {
		await this.ready;
		window.mw.hook('ve.activationComplete').add(handler);
	}

	async veActivate(handler: () => void): Promise<void> {
		await this.ready;
		window.mw.hook('ve.activate').add(handler);
	}

	async veDeactivationComplete(handler: () => void): Promise<void> {
		await this.ready;
		window.mw.hook('ve.deactivationComplete').add(handler);
	}

	async veDeactivate(handler: () => void): Promise<void> {
		await this.ready;
		window.mw.hook('ve.deactivate').add(handler);
	}
}

export const visualEditorEvents = new VisualEditorEvents();
