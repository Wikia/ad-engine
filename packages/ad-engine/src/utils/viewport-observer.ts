import { scrollListener } from '../listeners/index';
import { isInViewport } from './dimensions';

interface Listener extends ListenerParams {
	id?: string;
	element: HTMLElement;
	callback: ListenerCallback;
	inViewport: boolean;
}

type ListenerCallback = (inViewport: boolean) => void;

interface ListenerParams {
	offsetTop: number;
	offsetBottom: number;
	areaThreshold: number;
}

function updateInViewport(listener: Listener): void {
	const newInViewport: boolean = isInViewport(
		listener.element,
		listener.offsetTop,
		listener.offsetBottom,
		listener.areaThreshold,
	);

	if (newInViewport !== listener.inViewport) {
		listener.callback(newInViewport);
		listener.inViewport = newInViewport;
	}
}

function addListener(
	element: HTMLElement,
	callback: ListenerCallback,
	params: Partial<ListenerParams> = {},
): string {
	const listener: Listener = {
		element,
		callback,
		offsetTop: params.offsetTop || 0,
		offsetBottom: params.offsetBottom || 0,
		areaThreshold: params.areaThreshold,
		inViewport: false,
	};
	const updateCallback: () => void = () => {
		updateInViewport(listener);
	};

	listener.id = scrollListener.addCallback(updateCallback);
	updateCallback();

	return listener.id;
}

function removeListener(listenerId: string): void {
	scrollListener.removeCallback(listenerId);
}

export const viewportObserver = {
	addListener,
	removeListener,
};
