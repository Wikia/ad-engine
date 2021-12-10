import { MessageBox } from './message-box';

export class RegisterBox extends MessageBox {
	constructor() {
		super();
		this.type = 'REGISTER';
		this.redirectUrl = 'https://www.fandom.com/register';
		this.buttonText = 'Register';
		this.messageText = 'Join a passionate community of people who love what you love.';
	}
}
