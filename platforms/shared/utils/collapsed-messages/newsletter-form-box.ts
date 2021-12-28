import { AdSlot } from '@wikia/ad-engine';
import { MessageBox } from './message-box';

export class NewsletterFormBox extends MessageBox {
	constructor() {
		super();
		this.type = 'NEWSLETTER_FORM';
		this.messageText = 'THE LATEST TRENDS, DELIVERED STRAIGHT TO YOUR INBOX.';
		this.buttonText = 'Sign up';
	}

	create = (placeholder: HTMLElement, adSlot: AdSlot) => {
		const status_impression = `cm_${this.type.toLowerCase()}_impression`;

		const wrapper = this.createBoxWrapper();
		const message = this.createMessage();
		const form = this.createForm();
		const formMessage = this.createFormMessage();

		wrapper.append(message, form, formMessage);
		placeholder.append(wrapper);

		this.sendTrackingEvent(adSlot, status_impression);
	};

	private createForm = (): HTMLElement => {
		const form = document.createElement('form');
		form.className = 'newsletter-form';

		form.innerHTML = `
			<form class="newsletter-form">
				<input class="newsletter-email" type="email" placeholder="Email Address"/>
				<button class="newsletter-submit wds-button cm-button" type="submit">${this.buttonText}</button>
			</form>
		`;

		return form;
	};

	createFormMessage = (): HTMLElement => {
		const message = document.createElement('div');
		message.className = 'newsletter-message';
		message.innerHTML = '';
		return message;
	};
}
