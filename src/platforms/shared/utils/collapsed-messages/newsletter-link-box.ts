import { AdSlot } from '@wikia/ad-engine';
import { MessageBox } from './message-box';

export class NewsletterLinkBox extends MessageBox {
	constructor(adSlot: AdSlot) {
		super(adSlot);
		this.type = 'NEWSLETTER_LINK';
		this.redirectUrl = this.buildUrl(
			'http://linkst.fandom.com/join/6n2/fandomemailsign-uppage-wikibar?',
			'collapse_message_newsletter',
		);
		this.buttonText = 'Sign up';
		this.messageText = `Sign up today<br/>to receive weekly newsletters from Fandom`;
		this.statusImpression = 'cm_newsletter_link_impression';
		this.statusClicked = 'cm_newsletter_link_clicked';
	}
}
