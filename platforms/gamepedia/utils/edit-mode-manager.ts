import { visualEditorEvents } from './visual-editor-events';

type ModeChangeCallback = () => void;

export class EditModeManager {
	isInEditMode: boolean;
	private listenersActivate: ModeChangeCallback[] = [];
	private listenersDeactivate: ModeChangeCallback[] = [];

	constructor() {
		const isDesktopEditor = window.location.href.includes('veaction=edit');
		this.isInEditMode = isDesktopEditor;
		this.listenForChanges();
	}

	private listenForChanges(): void {
		visualEditorEvents.veActivate(() => this.emit(true));
		visualEditorEvents.veDeactivate(() => this.emit(false));
	}

	onActivate(listener: ModeChangeCallback): void {
		this.listenersActivate.push(listener);
	}

	onDeactivate(listener: ModeChangeCallback): void {
		this.listenersDeactivate.push(listener);
	}

	private emit(isInEditMode: boolean): void {
		this.isInEditMode = isInEditMode;
		const listeners = isInEditMode ? this.listenersActivate : this.listenersDeactivate;

		listeners.forEach((listener: ModeChangeCallback) => {
			listener();
		});
	}
}

export const editModeManager = new EditModeManager();
