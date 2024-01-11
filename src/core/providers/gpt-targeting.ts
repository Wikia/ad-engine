import { targetingService } from '../services';

export function initGptTargeting(): void {
	updateGptTargeting();

	targetingService.onChange((trigger, value) => {
		// trigger=null means that whole targeting
		// dictionary was replaced in the context
		if (trigger === null) {
			Object.keys(value).forEach((dictionaryKey) => {
				setTargetingValue(dictionaryKey, value[dictionaryKey]);
			});
		} else {
			setTargetingValue(trigger, value);
		}
	});
}

export function updateGptTargeting(): void {
	const targeting = targetingService.dump() || {};

	Object.keys(targeting).forEach((key) => {
		setTargetingValue(key, targeting[key]);
	});
}

function setTargetingValue(
	key: string,
	value: string | string[] | (() => string | string[]),
): void {
	const tag = window.googletag.pubads();

	if (typeof value === 'undefined' || value === null) {
		tag.clearTargeting(key);
	} else if (typeof value === 'function') {
		tag.setTargeting(key, value());
	} else {
		tag.setTargeting(key, value);
	}
}
