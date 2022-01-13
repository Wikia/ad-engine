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

	getElementsToAppend(): HTMLElement[] {
		sailthru.init();

		const elements: HTMLElement[] = [];
		elements.push(this.createForm(), this.createFormMessage());

		return elements;
	}

	private createForm(): HTMLElement {
		const form = document.createElement('form');
		form.className = 'newsletter-form';

		const input = this.createFormInput();
		const submitBtn = this.createFormButton();
		form.append(input, submitBtn);

		form.addEventListener('submit', (event) => this.doEmailSignUp(event));

		return form;
	}

	private createFormInput(): HTMLInputElement {
		const input = document.createElement('input');
		input.className = 'newsletter-email';
		input.type = 'email';
		input.placeholder = 'Email Address';

		return input;
	}

	private createFormButton(): HTMLButtonElement {
		const button = document.createElement('button');
		button.classList.add('newsletter-submit', 'wds-button', 'cm-button');
		button.type = 'submit';
		button.innerText = this.buttonText;

		button.addEventListener('click', () => {
			this.sendTrackingEvent(this.status_clicked);
		});

		return button;
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
