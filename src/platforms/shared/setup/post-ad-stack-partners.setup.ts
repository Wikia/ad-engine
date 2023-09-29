import {
	BrandMetrics,
	Captify,
	DiProcess,
	Eyeota,
	LiveConnect,
	LiveRampPixel,
	Lotame,
	Nielsen,
	PartnerPipeline,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class PostAdStackPartnersSetup implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private brandMetrics: BrandMetrics,
		private captify: Captify,
		private eyeota: Eyeota,
		private liveRampPixel: LiveRampPixel,
		private nielsen: Nielsen,
		private lotame: Lotame,
		private liveConnect: LiveConnect,
	) {}

	execute(): void {
		utils.logger('post-ad-stack-partners', 'starting');
		this.pipeline
			.add(
				this.lotame,
				this.liveConnect,
				this.liveRampPixel,
				this.brandMetrics,
				this.eyeota,
				this.captify,
				this.nielsen,
			)
			.execute()
			.then(() => {
				utils.logger('post-ad-stack-partners', 'finished');
			});
	}
}
