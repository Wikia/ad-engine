import { targetingService } from '../services';

export function setupGptTargeting(): void {
	const tag = window.googletag.pubads();

	function setTargetingValue(
		key: string,
		value: string | string[] | (() => string | string[]),
	): void {
		if (typeof value === 'undefined' || value === null) {
			tag.clearTargeting(key);
		} else if (typeof value === 'function') {
			tag.setTargeting(key, value());
		} else {
			tag.setTargeting(key, value);
		}
	}

	function setTargetingFromContext(): void {
		const targeting = targetingService.getAll() || {};

		Object.keys(targeting).forEach((key) => {
			setTargetingValue(key, targeting[key]);
		});
	}

	setTargetingFromContext();

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
