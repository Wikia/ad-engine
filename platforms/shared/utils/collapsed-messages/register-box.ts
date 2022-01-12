import { AdSlot } from '@wikia/ad-engine';
import { MessageBox } from './message-box';

export class RegisterBox extends MessageBox {
	constructor(adSlot: AdSlot) {
		super(adSlot);
		this.type = 'REGISTER';
		this.redirectUrl = 'https://www.fandom.com/register';
		this.buttonText = 'Register';
		this.messageText = 'Join a passionate community of people who love what you love.';
		this.status_impression = 'cm_register_impression';
		this.status_clicked = 'cm_register_clicked';
	}
}
