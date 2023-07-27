import { context } from '@ad-engine/core';
import { PlacementsBuilder } from './placements-builder';

export class PlacementHandler {
	protected anchor: Element | null;
	protected placementBuilder: PlacementsBuilder;

	constructor() {
		this.placementBuilder = new PlacementsBuilder();
	}

	init() {
		const selector = context.get('services.openweb.placementSelector');
		this.anchor = document.querySelector(selector);
	}

	public isReady(): boolean {
		return this.anchor !== null;
	}

	public buildPlacements(postUniqueId: string): void {
		const reactionElement = this.placementBuilder.buildReactionDivModule(postUniqueId);
		const standaloneAdElement = this.placementBuilder.buildStandaloneAdUnit();

		this.anchor.prepend(standaloneAdElement);
		this.anchor.prepend(reactionElement);
	}
}
