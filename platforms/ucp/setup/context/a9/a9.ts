import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpA9ConfigSetup implements DiProcess {
	execute(): void {
		context.set('bidders.a9.slots', this.getA9Context());
	}

	getA9Context(): object {
		return {
			bottom_leaderboard: {
				sizes: [
					[728, 90],
					[970, 250],
				],
			},
			incontent_boxad_1: {
				sizes: [
					[300, 250],
					[300, 600],
				],
			},
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
			featured: {
				type: 'video',
			},
		};
	}
}
