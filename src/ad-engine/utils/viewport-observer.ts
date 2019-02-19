import { scrollListener } from '../listeners';
import { isInViewport } from './dimensions';

function updateInViewport(listener) {
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

function addListener(element, callback, params = {}) {
	const listener = {
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
