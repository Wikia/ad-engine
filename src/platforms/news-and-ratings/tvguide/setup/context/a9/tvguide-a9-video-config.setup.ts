import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class TvGuideA9VideoConfigSetup implements DiProcess {
	execute(): void {
		context.set('bidders.a9.slots', this.getA9Context());
	}

	private getA9Context(): object {
		return {
			'leader-plus-top': {
				sizes: [
					[728, 90],
					[970, 250],
				],
			},
			'leader-plus-bottom': {
				sizes: [
					[728, 90],
					[970, 250],
				],
			},
			'mpu-plus-top': {
				sizes: [
					[300, 250],
					[300, 600],
				],
			},
			'incontent-leader-plus-bottom': {
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
