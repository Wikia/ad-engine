interface AnyclipApi {
	loaded: boolean;
	adBlock: boolean;
	widgets: Array<AnyclipWidget>;
	version: string;
	getWidget: () => AnyclipWidget;
}

interface AnyclipWidget {
	publisherId: string;
	widgetId: string;
	play: () => void;
	destroy: () => void;
	isDestroyed: () => boolean;
	floatingModeToggle: (floatingState: boolean) => void;
}
