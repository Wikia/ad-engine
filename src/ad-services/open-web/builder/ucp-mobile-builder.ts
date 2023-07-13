import { OpenWebPlacementBuilder } from './types';
import { UcpCommon } from './ucp-common';

export class UcpMobileBuilder extends UcpCommon implements OpenWebPlacementBuilder {
	public buildPlacement(postUniqueId: string): boolean {
		const boxes = document.querySelectorAll('div[class*="-boxad"]');

		if (boxes.length <= 3) {
			return false;
		}

		const targetBox = boxes[2];
		targetBox.innerHTML = null;

		const reactionElement = this.buildReactionDivModule(postUniqueId);
		const standaloneAdElement = this.buildStandaloneAdUnit();

		targetBox.prepend(standaloneAdElement);
		targetBox.prepend(reactionElement);

		return true;
	}
}
