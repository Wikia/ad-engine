import { context } from '@ad-engine/core';
import { OpenWebPlacementBuilder } from './types';
import { UcpCommon } from './ucp-common';

export class UcpDesktopBuilder extends UcpCommon implements OpenWebPlacementBuilder {
	public buildPlacement(postUniqueId: string): boolean {
		const selector = context.get('open-web.selector') || '#WikiaAdInContentPlaceHolder';
		const anchor = document.querySelector(selector);

		const reactionElement = this.buildReactionDivModule(postUniqueId);
		const standaloneAdElement = this.buildStandaloneAdUnit();

		anchor.prepend(standaloneAdElement);
		anchor.prepend(reactionElement);

		return true;
	}
}
