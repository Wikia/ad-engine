import { context, events, eventService } from '../services';

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

		Object.keys(targeting).forEach((key) => {
			setTargetingValue(key, targeting[key]);
		});
	}

	eventService.on(events.PAGE_CHANGE_EVENT, () => {
		setTargetingFromContext();
	});

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
