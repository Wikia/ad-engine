import { MessageBox } from './message-box';

export class NewsletterBox extends MessageBox {
	constructor() {
		super();
		this.type = 'NEWSLETTER';
		this.redirectUrl = this.buildUrl(
			'http://linkst.fandom.com/join/6n2/fandomemailsign-uppage-wikibar?',
			'collapse_message_newsletter',
		);
		this.buttonText = 'Sign up';
		this.messageText = `Sign up today<br/>to receive weekly newsletters from Fandom`;
	}
}
