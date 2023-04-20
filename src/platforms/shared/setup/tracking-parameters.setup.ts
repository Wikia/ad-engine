import { Context, context, DiProcess, InstantConfigService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { trackingUrls } from './tracking-urls';

export class TrackingParametersSetupExecutable {
	constructor(private fandomContext: WindowFandomContext, private context: Context) {}
	private async getTrackingParameters(): Promise<Partial<ITrackingParameters>> {
		await new utils.WaitFor(() => !!this.fandomContext?.tracking, 10, 100).until();

		return { ...this.fandomContext.tracking };
	}

	async execute() {
		const trackingParameters = await this.getTrackingParameters();

		this.context.set('wiki', { ...this.context.get('wiki'), ...trackingParameters });
	}
}
@Injectable()
export class TrackingParametersSetup implements DiProcess {
	constructor(private instantConfig: InstantConfigService) {}

	async execute() {
		const trackingParametersSetup = new TrackingParametersSetupExecutable(
			window.fandomContext,
			context,
		);
		await trackingParametersSetup.execute();

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
	}
}
