import { MessageBox } from './message-box';

export class FanLabBox extends MessageBox {
	constructor() {
		super();
		this.type = 'FANLAB';
		this.redirectUrl = this.buildUrl();
		this.buttonText = 'Join Fan Lab';
		this.messageText = `Join Fan Lab,<br/>an exclusive online community of fans and superfans.`;
	}

	private buildUrl = (): string => {
		const basicUrl = 'https://www.fandom.com/fanlab/?';
		const utm_source = 'fandom';
		const utm_medium = 'ctr';
		const utm_campaign = 'collapse_message_fan_lab';
		const utm_content = 'button';
		const params = [
			`utm_source=${utm_source}`,
			`utm_medium=${utm_medium}`,
			`utm_campaign=${utm_campaign}`,
			`utm_content=${utm_content}`,
		];

		return basicUrl + params.join('&');
	};
}
