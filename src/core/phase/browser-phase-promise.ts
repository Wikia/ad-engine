import { getTimeOrigin, logger } from '../utils';

function browserPhasePromise(
	check: () => boolean,
	container: any,
	event: string,
	ttl: number,
): Promise<void> {
	return new Promise((resolve) => {
		const logGroup = `ae-promise-${event}-ttl-${ttl}`;
		let resolved = false;

		function setResolvedState(msg: string) {
			if (!resolved) {
				logger(logGroup, msg);
				resolved = true;
				resolve();
			}
		}

		if (check()) {
			setResolvedState('resolved by check');
			return;
		}
		const timeout = ttl - (new Date().getTime() - getTimeOrigin());
		if (timeout <= 0) {
			setResolvedState('resolved after ttl');
			return;
		}

		const timeoutId = setTimeout(() => {
			setResolvedState('resolved by timeout');
		}, timeout);

		container.addEventListener(event, () => {
			setResolvedState('resolved on event');
			clearTimeout(timeoutId);
		});
	});
}

export function domContentLoadedWithTtlPromise(ttl: number) {
	return browserPhasePromise(
		() => document.readyState !== 'loading',
		document,
		'DOMContentLoaded',
		ttl,
	);
}

export function docLoadedWithTtlPromise(ttl: number) {
	return browserPhasePromise(() => document.readyState === 'complete', window, 'load', ttl);
}
