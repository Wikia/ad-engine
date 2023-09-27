import { context } from '@ad-engine/core';
import { Injectable } from '@wikia/dependency-injection';
import { PlacementsBuilder } from './placements-builder';

@Injectable()
export class PlacementsHandler {
	private anchor: Element | null;

	constructor(private placementBuilder: PlacementsBuilder) {}

	private init() {
		const selector = context.get('services.openWeb.placementSelector');
		this.anchor = document.querySelector(selector);
	}

	public isDone(): boolean {
		return this.anchor !== null;
	}

	public build(postUniqueId: string): void {
		this.init();

		if (!this.isDone()) {
			return;
		}

		const reactionElement = this.placementBuilder.buildReactionDivModule(postUniqueId);
		const standaloneAdElement = this.placementBuilder.buildStandaloneAdUnit();

		const wrapper = document.createElement('div');
		wrapper.classList.add('openweb-wrapper');

		wrapper.prepend(standaloneAdElement);
		wrapper.prepend(reactionElement);

		this.anchor.prepend(wrapper);
	}
}
