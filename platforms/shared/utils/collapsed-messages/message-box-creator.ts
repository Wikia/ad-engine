import { AdSlot } from '@wikia/ad-engine';
import { FanLabBox } from './fanlab-box';
import { MessageBox } from './message-box';
import { MessageBoxType } from './message-box-service';
import { NewsletterFormBox } from './newsletter-form-box';
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
			case 'NEWSLETTER_FORM':
				return new NewsletterFormBox(adSlot);
			default:
				throw new Error('Unknown Message Box type');
		}
	}
}
