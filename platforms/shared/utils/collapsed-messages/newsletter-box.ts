import { MessageBox } from './message-box';

export class NewsletterBox extends MessageBox {
	constructor() {
		super();
		this.type = 'NEWSLETTER';
		this.redirectUrl = this.buildUrl();
		this.buttonText = 'Sign up';
		this.messageText = `Sign up today<br/>to receive weekly newsletters from Fandom`;
	}

	private buildUrl = (): string => {
		const basicUrl = 'http://linkst.fandom.com/join/6n2/fandomemailsign-uppage-wikibar?';
		const utm_source = 'fandom';
		const utm_medium = 'ctr';
		const utm_campaign = 'collapse_message_newsletter';
		const utm_content = 'button';
		const params = [
			`utm_source=${utm_source}`,
			`utm_medium=${utm_medium}`,
			`utm_campaign=${utm_campaign}`,
			`utm_content=${utm_content}`,
		];

		return basicUrl + params.join('&');
	};
}
