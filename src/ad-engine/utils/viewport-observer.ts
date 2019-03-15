import { scrollListener } from '../listeners';
import { isInViewport } from './dimensions';

interface Listener {
	id?: string;
	element: any;
	callback: any;
	offsetTop: any;
	offsetBottom: any;
	areaThreshold: any;
	inViewport: any;
}

function updateInViewport(listener: Listener): void {
	const newInViewport = isInViewport(
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

function addListener(element: any, callback: any, params = {}) {
	const listener: Listener = {
		element,
		callback,
		offsetTop: params.offsetTop || 0,
		offsetBottom: params.offsetBottom || 0,
		areaThreshold: params.areaThreshold,
		inViewport: false,
	};
	const updateCallback = () => {
		updateInViewport(listener);
	};

	listener.id = scrollListener.addCallback(updateCallback);
	updateCallback();

	return listener.id;
}

function removeListener(listenerId) {
	scrollListener.removeCallback(listenerId);
}

export const viewportObserver = {
	addListener,
	removeListener,
};
