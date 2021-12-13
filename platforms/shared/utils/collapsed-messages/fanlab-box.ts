import { MessageBox } from './message-box';

export class FanLabBox extends MessageBox {
	constructor() {
		super();
		this.type = 'FANLAB';
		this.redirectUrl = 'https://www.fandom.com/fanlab/';
		this.buttonText = 'Sign Up';
		this.messageText = 'Join our Fan Lab community.';
	}
}
