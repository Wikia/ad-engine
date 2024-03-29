import { AdSlot } from '@wikia/ad-engine';
import { MessageBox } from './message-box';

export class FanLabBox extends MessageBox {
	constructor(adSlot: AdSlot) {
		super(adSlot);
		this.type = 'FANLAB';
		this.redirectUrl = this.buildUrl('https://www.fandom.com/fanlab/?', 'collapse_message_fan_lab');
		this.buttonText = 'Join Fan Lab';
		this.messageText = `Join Fan Lab,<br/>an exclusive online community of fans and superfans.`;
		this.statusImpression = 'cm_fanlab_impression';
		this.statusClicked = 'cm_fanlab_clicked';
	}
}
