import { mediaWikiWrapper } from './media-wiki-wrapper';

class VisualEditorEvents {
	async veActivationComplete(handler: () => void): Promise<void> {
		await mediaWikiWrapper.ready;
		window.mw.hook('ve.activationComplete').add(handler);
	}

	async veActivate(handler: () => void): Promise<void> {
		await mediaWikiWrapper.ready;
		window.mw.hook('ve.activate').add(handler);
	}

	async veDeactivationComplete(handler: () => void): Promise<void> {
		await mediaWikiWrapper.ready;
		window.mw.hook('ve.deactivationComplete').add(handler);
	}

	async veDeactivate(handler: () => void): Promise<void> {
		await mediaWikiWrapper.ready;
		window.mw.hook('ve.deactivate').add(handler);
	}
}

export const visualEditorEvents = new VisualEditorEvents();
