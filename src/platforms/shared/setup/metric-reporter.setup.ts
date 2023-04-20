import { context, DiProcess, InstantConfigService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MetricReporterSetup implements DiProcess {
	constructor(private instantConfig: InstantConfigService) {}

	async execute() {
		context.set('services.monitoring.endpoint', utils.getServicesBaseURL().slice(0, -1));
		context.set('services.monitoring.service', 'icbm');
		context.set(
			'services.monitoring.threshold',
			this.instantConfig.get('icMonitorTrafficThreshold'),
		);
	}
}
