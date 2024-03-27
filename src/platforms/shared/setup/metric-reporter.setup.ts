import {
	context,
	DiProcess,
	InstantConfigService,
	MetricReporter,
	metricReporterSender,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MetricReporterSetup implements DiProcess {
	constructor(private instantConfig: InstantConfigService) {}

	async execute() {
		const serviceUrl = utils.getServicesBaseURL() || '';
		context.set('services.monitoring.endpoint', serviceUrl.replace(/\/+$/, ''));
		context.set('services.monitoring.service', 'adeng');
		const icMonitorTrafficThreshold = this.instantConfig.get('icMonitorTrafficThreshold', {
			default: 0,
		});
		const monitorTrafficThreshold =
			typeof icMonitorTrafficThreshold === 'number'
				? { default: icMonitorTrafficThreshold }
				: icMonitorTrafficThreshold;
		Object.keys(monitorTrafficThreshold).forEach((key) => {
			context.set(`services.monitoring-${key}.threshold`, monitorTrafficThreshold[key]);
		});

		if (utils.outboundTrafficRestrict.isOutboundTrafficAllowed('monitoring-default')) {
			metricReporterSender.activate();
		}
		new MetricReporter(metricReporterSender).initialise();
	}
}
