import { context, events } from '../services';

export function setupGptTargeting() {
	const tag = window.googletag.pubads();
	const targeting = context.get('targeting');

	function setTargetingValue(key, value) {
		if (typeof value === 'undefined' || value === null) {
			tag.clearTargeting(key);
		} else if (typeof value === 'function') {
			tag.setTargeting(key, value());
		} else {
			tag.setTargeting(key, value);
		}
	}

	function setTargetingFromContext() {
		Object.keys(targeting).forEach((key) => {
			setTargetingValue(key, targeting[key]);
		});
	}

	events.on(events.PAGE_CHANGE_EVENT, () => {
		setTargetingFromContext();
	});

	setTargetingFromContext();

	context.onChange('targeting', (trigger, value) => {
		const segments = trigger.split('.');
		const key = segments[segments.length - 1];

		setTargetingValue(key, value);
	});
}
