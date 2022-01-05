import { AdSlot, sailthru, SailthruSource, UserSignupPayload } from '@wikia/ad-engine';
import { MessageBox } from './message-box';

export class NewsletterFormBox extends MessageBox {
	constructor(adSlot: AdSlot) {
		super(adSlot);
		this.type = 'NEWSLETTER_FORM';
		this.messageText = 'THE LATEST TRENDS, DELIVERED STRAIGHT TO YOUR INBOX.';
		this.buttonText = 'Sign up';
	}

	create = () => {
		const status_impression = `cm_${this.type.toLowerCase()}_impression`;

		const placeholder = this.adSlot.getPlaceholder();
		const wrapper = this.createBoxWrapper();
		const message = this.createMessage();
		const form = this.createForm();
		form.addEventListener('submit', (event) => this.doEmailSignUp(event));
		const formMessage = this.createFormMessage();

		wrapper.append(message, form, formMessage);
		placeholder.append(wrapper);

		this.sendTrackingEvent(status_impression);
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

	private createPayload = (email: string, submitBtn: HTMLButtonElement): UserSignupPayload => {
		const status_clicked = `cm_${this.type.toLowerCase()}_clicked`;

		const onSuccess = (): void => {
			this.showFormMessage('Thanks for signing up!');
			submitBtn.disabled = false;
			this.sendTrackingEvent(status_clicked);
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
	};

	private showFormMessage = (text: string) => {
		const messageArea: HTMLDivElement = document.querySelector('.newsletter-message');
		messageArea.innerText = text;
	};

	private doEmailSignUp = (event) => {
		event.preventDefault();

		const emailInput: HTMLInputElement = document.querySelector('.newsletter-email');
		const emailValue = emailInput.value;
		const submitBtn: HTMLButtonElement = document.querySelector('.newsletter-submit');
		submitBtn.disabled = true;

		if (!sailthru.isLoaded()) {
			this.showFormMessage('An error occurred. Please try again later.');
			submitBtn.disabled = false;
			return;
		}

		const payload: UserSignupPayload = this.createPayload(emailValue, submitBtn);
		const source: SailthruSource = 'adengine_in_content_ad';

		sailthru.userSignup(payload, source);
	};
}
