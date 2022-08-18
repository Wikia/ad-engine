import { context } from '../services';

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
		const targeting = context.get('targeting') || {};
		const audigentTestEnabled = context.get('services.audigent.gamDirectTestEnabled');

		Object.keys(targeting).forEach((key) => {
			if (key === 'AU_SEG' && audigentTestEnabled) {
				if (tag.getTargeting(key).length === 0) {
					setTargetingValue(key, '-1');
				}
				return;
			}

			setTargetingValue(key, targeting[key]);
		});
	}

	setTargetingFromContext();

	context.onChange('targeting', (trigger, value) => {
		const segments = trigger.split('.');
		const key = segments[segments.length - 1];

		// trigger=targeting means that whole targeting
		// dictionary was replaced in the context
		if (trigger === 'targeting') {
			Object.keys(value).forEach((dictionaryKey) => {
				setTargetingValue(dictionaryKey, value[dictionaryKey]);
			});
		} else {
			setTargetingValue(key, value);
		}
	});
}
