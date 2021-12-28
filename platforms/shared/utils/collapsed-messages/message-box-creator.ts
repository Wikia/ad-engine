import { FanLabBox } from './fanlab-box';
import { MessageBox } from './message-box';
import { MessageBoxType } from './message-box-service';
import { NewsletterFormBox } from './newsletter-form-box';
import { NewsletterLinkBox } from './newsletter-link-box';
import { RegisterBox } from './register-box';

export class MessageBoxCreator {
	createMessageBox = (type: MessageBoxType): MessageBox => {
		switch (type) {
			case 'REGISTER':
				return new RegisterBox();
			case 'FANLAB':
				return new FanLabBox();
			case 'NEWSLETTER_LINK':
				return new NewsletterLinkBox();
			case 'NEWSLETTER_FORM':
				return new NewsletterFormBox();
			default:
				throw new Error('Unknown Message Box type');
		}
	};
}
