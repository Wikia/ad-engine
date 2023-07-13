import { AdSlot } from '@wikia/ad-engine';
import { FanLabBox } from './fanlab-box';
import type { MessageBox } from './message-box';
import type { MessageBoxType } from './message-box-type';
import { NewsletterLinkBox } from './newsletter-link-box';
import { RegisterBox } from './register-box';

export class MessageBoxCreator {
	createMessageBox(type: MessageBoxType, adSlot: AdSlot): MessageBox {
		switch (type) {
			case 'REGISTER':
				return new RegisterBox(adSlot);
			case 'FANLAB':
				return new FanLabBox(adSlot);
			case 'NEWSLETTER_LINK':
				return new NewsletterLinkBox(adSlot);
			default:
				throw new Error('Unknown Message Box type');
		}
	}
}
