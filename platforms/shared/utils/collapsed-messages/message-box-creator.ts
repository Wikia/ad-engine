import { FanLabBox } from './fanlab-box';
import { MessageBox } from './message-box';
import { MessageBoxType } from './message-box-service';
import { NewsletterBox } from './newsletter-box';
import { RegisterBox } from './register-box';

export class MessageBoxCreator {
	createMessageBox = (type: MessageBoxType): MessageBox => {
		switch (type) {
			case 'REGISTER':
				return new RegisterBox();
			case 'FANLAB':
				return new FanLabBox();
			case 'NEWSLETTER':
				return new NewsletterBox();
			default:
				throw new Error('Unknown Message Box type');
		}
	};
}
