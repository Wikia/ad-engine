import { InstantConfigServiceInterface } from '@wikia/ad-engine';
import { IcSequentialMessaging } from './data-structures/ic-sequential-messaging';
import { SequentialMessagingCookie } from './data-structures/sequential-messaging-cookie';
import { CookieJarInterface } from './interfaces/cookie-jar-interface';
import { SequenceDetector } from './sequence-detector';

export class SequenceHandler {
	constructor(
		private instantConfig: InstantConfigServiceInterface,
		private cookieJar: CookieJarInterface,
	) {}

	handleItem(lineItemId: string): void {
		const icSequentialMessaging: IcSequentialMessaging = this.instantConfig.get(
			'icSequentialMessaging',
		);

		if (!this.validateInstantConfigInput(icSequentialMessaging)) {
			return;
		}

		const sequenceDetector = new SequenceDetector(icSequentialMessaging);

		if (sequenceDetector.isAdSequential(lineItemId.toString())) {
			this.storeCookie(lineItemId, icSequentialMessaging);
		}
	}

	private validateInstantConfigInput(icSequentialMessaging: IcSequentialMessaging): boolean {
		if (typeof icSequentialMessaging !== 'object') {
			return false;
		}

		for (const val of Object.values(icSequentialMessaging)) {
			if (typeof val !== 'object') return false;
			if (!('length' in val)) return false;
			if (typeof val.length !== 'string' && typeof val.length !== 'number') return false;
		}

		return true;
	}

	private storeCookie(lineItemId: string, icbmLineItems: IcSequentialMessaging): void {
		const cookie: SequentialMessagingCookie = {};
		cookie[lineItemId] = { length: icbmLineItems[lineItemId].length as number };

		this.cookieJar.set('sequential_messaging', cookie);
	}
}
