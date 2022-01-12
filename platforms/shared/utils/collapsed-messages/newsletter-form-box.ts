import { AdSlot, sailthru, UserSignupPayload } from '@wikia/ad-engine';
import { isEmailValid } from '../email-validator';
import { MessageBox } from './message-box';


export class NewsletterFormBox extends MessageBox {
	constructor(adSlot: AdSlot) {
		super(adSlot);
		this.type = 'NEWSLETTER_FORM';
		this.messageText = 'THE LATEST TRENDS, DELIVERED STRAIGHT TO YOUR INBOX.';
		this.buttonText = 'Sign up';
		this.status_impression = 'cm_newsletter_form_impression';
		this.status_clicked = 'cm_newsletter_form_clicked';
	}

	create(): void {
		sailthru.init();

		const placeholder = this.adSlot.getPlaceholder();
		if (!placeholder) {
			throw new Error(`No placeholder to insert '${this.type}' Message Box`);
		}

		const wrapper = this.createBoxWrapper();
		const message = this.createMessage();
		const form = this.createForm();
		form.addEventListener('submit', (event) => this.doEmailSignUp(event));
		const formMessage = this.createFormMessage();

		wrapper.append(message, form, formMessage);
		placeholder.append(wrapper);

		this.sendTrackingEvent(this.status_impression);
	}

	private createForm(): HTMLElement {
		const form = document.createElement('form');
		form.className = 'newsletter-form';

		form.innerHTML = `
			<input class="newsletter-email" type="email" placeholder="Email Address"/>
			<button class="newsletter-submit wds-button cm-button" type="submit">${this.buttonText}</button>
		`;

		return form;
	}

	private createFormMessage(): HTMLElement {
		const message = document.createElement('div');
		message.className = 'newsletter-message';
		return message;
	}

	private createPayload(email: string, submitBtn: HTMLButtonElement): UserSignupPayload {
		const onSuccess = (): void => {
			this.showFormMessage('Thanks for signing up!');
			submitBtn.disabled = false;
			this.sendTrackingEvent(this.status_clicked);
		};

		const onError = (): void => {
			this.showFormMessage('An error occurred. Please try again later.');
			submitBtn.disabled = false;
		};

		return {
			email,
			onSuccess,
			onError,
		};
	}

	private showFormMessage(text: string): void {
		const messageArea: HTMLDivElement = document.querySelector('.newsletter-message');
		messageArea.innerText = text;
	}

	private doEmailSignUp(event): void {
		event.preventDefault();

		const emailInput: HTMLInputElement = document.querySelector('.newsletter-email');
		const emailValue = emailInput.value;
		const submitBtn: HTMLButtonElement = document.querySelector('.newsletter-submit');
		submitBtn.disabled = true;

		if (!isEmailValid(emailValue)) {
			this.showFormMessage('Please enter a valid email address.');
			submitBtn.disabled = false;
			return;
		}

		const payload = this.createPayload(emailValue, submitBtn);
		const source = 'adengine_in_content_ad';

		sailthru.userSignup(payload, source);
	}
}
