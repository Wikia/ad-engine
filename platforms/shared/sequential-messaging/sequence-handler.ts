import { InstantConfigServiceInterface } from '@wikia/ad-engine';
import { IcSequentialMessaging } from './data-structures/ic-sequential-messaging';
import { SequentialMessagingCookie } from './data-structures/sequential-messaging-cookie';
import { DetectorFactory } from './detector-factory';

export interface CookieJar {
	set(name: string, value: SequentialMessagingCookie): void;
}

export class SequenceHandler {
	constructor(private instantConfig: InstantConfigServiceInterface, private cookieJar: CookieJar) {}

	handleItem(lineItemId: string): void {
		const icbmLineItems: IcSequentialMessaging = this.instantConfig.get('icSequentialMessaging');

		const sequenceDetector = new DetectorFactory(icbmLineItems).makeSequenceDetector();

		if (sequenceDetector.isAdSequential(lineItemId.toString())) {
			this.storeCookie(lineItemId, icbmLineItems);
		}
	}

	private storeCookie(lineItemId: string, icbmLineItems: IcSequentialMessaging): void {
		const cookie: SequentialMessagingCookie = {};
		cookie[lineItemId] = { length: icbmLineItems[lineItemId].length as number };

		this.cookieJar.set('sequential_messaging', cookie);
	}
}
