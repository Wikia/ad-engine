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

		const placeholder = this.createPlaceholder();

		const wrapper = this.createBoxWrapper();
		const message = this.createMessage();
		const form = this.createForm();
		form.addEventListener('submit', (event) => this.doEmailSignUp(event));
		const formMessage = this.createFormMessage();
		const submitBtn = form.querySelector('.newsletter-submit');
		submitBtn.addEventListener('click', () => {
			this.sendTrackingEvent(this.status_clicked);
		});

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

	private createPayload(email: string): UserSignupPayload {
		return {
			email,
			onSuccess: () => this.showFormMessage('Thanks for signing up!'),
			onError: () => this.showFormMessage('An error occurred. Please try again later.'),
		};
	}

	private showFormMessage(text: string): void {
		const messageArea: HTMLDivElement = document.querySelector('.newsletter-message');
		messageArea.innerText = text;

		const submitBtn: HTMLButtonElement = document.querySelector('.newsletter-submit');
		submitBtn.disabled = false;
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

		const payload = this.createPayload(emailValue);
		const source = 'adengine_in_content_ad';

		sailthru.userSignup(payload, source);
	}
}
