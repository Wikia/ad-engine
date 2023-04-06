import { Context, context, DiProcess, utils } from '@wikia/ad-engine';
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
	async execute() {
		const trackingParametersSetup = new TrackingParametersSetupExecutable(
			window.fandomContext,
			context,
		);

		await trackingParametersSetup.execute();
	}
}
