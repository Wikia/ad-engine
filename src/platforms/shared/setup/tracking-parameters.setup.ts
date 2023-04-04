import { context, DiProcess, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class TrackingParametersSetup implements DiProcess {
	private async getTrackingParameters(): Promise<Partial<ITrackingParameters>> {
		await new utils.WaitFor(() => !!window.fandomContext?.tracking, 10, 100).until();

		return { ...window.fandomContext.tracking };
	}

	async execute() {
		const trackingParameters = await this.getTrackingParameters();

		context.set('wiki', { ...context.get('wiki'), ...trackingParameters });
	}
}
