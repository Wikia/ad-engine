import { getTimeOrigin, logger } from '../utils';

function browserPhasePromise(
	check: () => boolean,
	container: any,
	event: string,
	tts: number,
): Promise<void> {
	return new Promise((resolve) => {
		const logGroup = `ae-promise-${event}-tts-${tts}`;
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
		const timeout = tts - (new Date().getTime() - getTimeOrigin());
		if (timeout <= 0) {
			setResolvedState('resolved after tts');
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

export function domContentLoadedPromise(tts: number) {
	return browserPhasePromise(
		() => document.readyState !== 'loading',
		document,
		'DOMContentLoaded',
		tts,
	);
}

export function documentLoadedPromise(tts: number) {
	return browserPhasePromise(() => document.readyState === 'complete', window, 'load', tts);
}
