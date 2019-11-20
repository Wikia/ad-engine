import { DynamicSlotsSetup } from '@platforms/shared';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDynamicSlotsSetup implements DynamicSlotsSetup {
	configureDynamicSlots(): void {
		this.injectTopLeaderboardPlaceholder();
	}

	private injectTopLeaderboardPlaceholder(): void {
		const container = document.querySelector('.WikiaPage');
		const topLeadeboardWrapper = document.createElement('div');
		const parentElement = container.parentNode;

		topLeadeboardWrapper.id = 'top_leaderboard';
		parentElement.insertBefore(topLeadeboardWrapper, container);
	}
}
