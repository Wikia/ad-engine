import { utils } from '@ad-engine/core';

const logGroup = 'Anyclip';
const isSubscribeReady = () => typeof window['lreSubscribe'] !== 'undefined';

export class AnyclipTracker {
	private anyclipEvents = [
		'WidgetLoad',
		'adImpression',
		'adSkipped',
		'adFirstQuartile',
		'adMidpoint',
		'adThirdQuartile',
		'adComplete',
		'adClick',
	];

	register() {
		this.waitForSubscribeReady().then((isSubscribeReady) => {
			utils.logger(
				logGroup,
				'Anyclip global subscribe function set',
				isSubscribeReady,
				window['lreSubscribe'],
			);
			isSubscribeReady
				? this.setupAnyclipListeners()
				: utils.logger(logGroup, 'Anyclip global subscribe function set');
		});
	}

	private waitForSubscribeReady(): Promise<boolean> {
		return new utils.WaitFor(isSubscribeReady, 4, 250).until();
	}

	private setupAnyclipListeners() {
		const subscribe = window['lreSubscribe'];

		this.anyclipEvents.map((eventName) =>
			subscribe((data) => console.log(`Anyclip ${eventName} event data: `, data), eventName),
		);
	}
}
