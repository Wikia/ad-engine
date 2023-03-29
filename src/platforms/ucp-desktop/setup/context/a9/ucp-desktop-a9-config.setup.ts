import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDesktopA9ConfigSetup implements DiProcess {
	execute(): void {
		context.set('bidders.a9.slots', this.getA9Context());
	}

	getA9Context(): object {
		return {
			top_leaderboard: {
				sizes: [
					[728, 90],
					[970, 250],
				],
			},
			top_boxad: {
				sizes: [
					[300, 250],
					[300, 600],
				],
			},
			incontent_leaderboard: {
				sizes: [[728, 90]],
			},
			incontent_boxad_1: {
				sizes: [
					[300, 250],
					[300, 600],
				],
			},
			bottom_leaderboard: {
				sizes: [
					[728, 90],
					[970, 250],
				],
			},
			featured: {
				type: 'video',
			},
		};
	}
}
