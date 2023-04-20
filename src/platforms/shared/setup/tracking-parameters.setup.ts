import { Context, context, DiProcess, InstantConfigService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

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

		const dwTracks = [
			'AdEngLoadTimes',
			'AdEngBidders',
			'AdEngViewability',
			'AdEngPlayerInfo',
			'KeyVals',
			'AdEngAdSizeInfo',
			'AdEngLabradorInfo',
		];

		dwTracks.forEach((dwTrackService) => {
			const dwTrackServiceLowercase = dwTrackService.toLowerCase();
			context.set(
				`services.dw-tracker-${dwTrackServiceLowercase}.threshold`,
				utils.queryString.get(`dw_tracker_${dwTrackServiceLowercase}_threshold`) ??
					this.instantConfig.get(`icDwTrackerTraffic${dwTrackService}Threshold`),
			);
		});
	}
}
