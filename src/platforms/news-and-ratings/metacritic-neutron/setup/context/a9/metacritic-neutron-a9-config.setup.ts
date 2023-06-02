import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MetacriticNeutronA9ConfigSetup implements DiProcess {
	execute(): void {
		context.set('bidders.a9.slots', this.getA9Context());
	}

	private getA9Context(): object {
		const desktopSlots = {
			top_leaderboard: {
				sizes: [[728, 90]],
			},
			top_boxad: {
				sizes: [[300, 250]],
			},
			incontent_boxad: {
				sizes: [[300, 250]],
			},
			bottom_leaderboard: {
				sizes: [[728, 90]],
			},
			video: {
				type: 'video',
			},
		};

		const mobileSlots = {
			top_leaderboard: {
				sizes: [[320, 50]],
			},
			incontent_boxad: {
				sizes: [
					[300, 250],
					[320, 50],
				],
			},
			video: {
				type: 'video',
			},
		};

		return context.get('state.isMobile') ? mobileSlots : desktopSlots;
	}
}
