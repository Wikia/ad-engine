import { logger } from '../utils';

function browserPhasePromise(
	check: () => boolean,
	timeout: number,
	container: any,
	event: string,
	delayOnEvent?: number,
): Promise<void> {
	return new Promise((resolve) => {
		let resolved = false;

		function setResolvedState(msg: string, onEvent = false) {
			if (resolved) {
				return;
			}
			const resolveThis = () => {
				logger(`wait-${event}`, `${msg}, timeout: ${timeout}, delay: ${delayOnEvent ?? 0}`);
				resolved = true;
				resolve();
			};
			if (delayOnEvent && onEvent) {
				setTimeout(resolveThis, delayOnEvent);
			} else {
				resolveThis();
			}
		}

		if (check()) {
			setResolvedState('resolved by check');
			return;
		}
		if (timeout <= 0) {
			setResolvedState('resolved after timeout');
			return;
		}

		const timeoutId = setTimeout(() => {
			setResolvedState('resolved by timeout');
		}, timeout);

		container.addEventListener(event, () => {
			clearTimeout(timeoutId);
			setResolvedState('resolved on event', true);
		});
	});
}

export function domContentLoadedPromise(timeout: number, delayOnEvent?: number) {
	return browserPhasePromise(
		() => document.readyState !== 'loading',
		timeout,
		document,
		'DOMContentLoaded',
		delayOnEvent,
	);
}

export function documentLoadedPromise(timeout: number, delayOnEvent?: number) {
	return browserPhasePromise(
		() => document.readyState === 'complete',
		timeout,
		window,
		'load',
		delayOnEvent,
	);
}
