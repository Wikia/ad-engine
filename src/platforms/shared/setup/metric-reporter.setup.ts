import { context, DiProcess, InstantConfigService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MetricReporterSetup implements DiProcess {
	constructor(private instantConfig: InstantConfigService) {}

	async execute() {
		const serviceUrl = utils.getServicesBaseURL() || '';
		context.set('services.monitoring.endpoint', serviceUrl.replace(/\/+$/, ''));
		context.set('services.monitoring.service', 'adeng');
		context.set(
			'services.monitoring.threshold',
			this.instantConfig.get('icMonitorTrafficThreshold', 0),
		);
	}
}
