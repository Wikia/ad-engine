import { AdSlot, sailthru } from '@wikia/ad-engine';
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
		form.addEventListener('submit', (event) => this.doEmailSignUp(event, adSlot.getSlotName()));
		const formMessage = this.createFormMessage();

		wrapper.append(message, form, formMessage);
		placeholder.append(wrapper);

		this.sendTrackingEvent(adSlot.getSlotName(), status_impression);
	};

	private createForm = (): HTMLElement => {
		const form = document.createElement('form');
		form.className = 'newsletter-form';

		form.innerHTML = `
			<input class="newsletter-email" type="email" placeholder="Email Address"/>
			<button class="newsletter-submit wds-button cm-button" type="submit">${this.buttonText}</button>
		`;

		return form;
	};

	private createFormMessage = (): HTMLElement => {
		const message = document.createElement('div');
		message.className = 'newsletter-message';
		return message;
	};

	private showFormMessage = (text: string) => {
		const messageArea: HTMLDivElement = document.querySelector('.newsletter-message');
		messageArea.innerText = text;
	};

	private doEmailSignUp = (event, adSlotName: string) => {
		event.preventDefault();

		const status_clicked = `cm_${this.type.toLowerCase()}_clicked`;
		const emailInput: HTMLInputElement = document.querySelector('.newsletter-email');
		const emailValue = emailInput.value;
		const submitBtn: HTMLButtonElement = document.querySelector('.newsletter-submit');
		submitBtn.disabled = true;

		const onSuccess = () => {
			this.showFormMessage('Thanks for signing up!');
			submitBtn.disabled = false;
			this.sendTrackingEvent(adSlotName, status_clicked);
		};

		const onError = () => {
			this.showFormMessage('An error occurred. Please try again later.');
			submitBtn.disabled = false;
		};

		if (!sailthru.isLoaded()) {
			this.showFormMessage('An error occurred. Please try again later.');
			submitBtn.disabled = false;
			return;
		}

		sailthru.signup(emailValue, onSuccess, onError);
	};
}
