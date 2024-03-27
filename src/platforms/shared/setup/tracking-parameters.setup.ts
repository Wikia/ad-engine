import {
	context,
	DiProcess,
	InstantConfigService,
	targetingService,
  trackingUrls,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class TrackingParametersSetup implements DiProcess {
	constructor(private instantConfig: InstantConfigService) {}

	async execute() {
		await this.setTrackingParameters();
		context.set(
			'services.dw-tracker.compression',
			this.instantConfig.get('dwTrafficCompression', false),
		);

		Object.values(trackingUrls).forEach((trackingUrlConfig) => {
			const dwTrackServiceLowercase = trackingUrlConfig.name.toLowerCase();
			if (trackingUrlConfig.allowed.sampling) {
				context.set(
					`services.dw-tracker-${dwTrackServiceLowercase}.threshold`,
					this.instantConfig.get(`dwTrafficLimits`, {})[trackingUrlConfig.icbmName]?.sample,
				);
			}

			context.set(
				`services.dw-tracker-${dwTrackServiceLowercase}.aggregate`,
				trackingUrlConfig.allowed.aggregation
					? this.instantConfig.get(`dwTrafficLimits`, {})[trackingUrlConfig.icbmName]?.agg
					: false,
			);
		});

		if (window.ads?.version?.ae) {
			targetingService.set('aeVer', window.ads.version.ae);
		}
	}

	private async getTrackingParameters(): Promise<Partial<ITrackingParameters>> {
		await new utils.WaitFor(() => !!window.fandomContext?.tracking, 10, 100).until();

		return {
			...window.fandomContext.tracking,
		};
	}

	async setTrackingParameters() {
		const trackingParameters = await this.getTrackingParameters();

		context.set('wiki', { ...context.get('wiki'), ...trackingParameters });
	}
}
