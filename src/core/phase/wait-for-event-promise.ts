import { communicationService, EventOptions } from '@ad-engine/communication';

export function waitForEventPromise(event: EventOptions, timeout?: number): Promise<void> {
	return new Promise<void>((resolve) => {
		const timeoutId = timeout && setTimeout(resolve, timeout);

		communicationService.on(event, () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			resolve();
		});
	});
}
