import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpMercuryA9ConfigSetup implements DiProcess {
	execute(): void {
		context.set('bidders.a9.slots', this.getA9Context());
	}

	getA9Context(): object {
		return {
			mobile_top_leaderboard: {
				sizes: [[320, 50]],
			},
			mobile_in_content: {
				sizes: [[300, 250]],
			},
			bottom_leaderboard: {
				sizes: [
					[320, 50],
					[300, 250],
				],
			},
			floor_adhesion: {
				sizes: [
					[300, 50],
					[320, 50],
					[320, 100],
				],
			},
			featured: {
				type: 'video',
			},
		};
	}
}
