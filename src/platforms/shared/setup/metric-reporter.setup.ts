import { context, InstantConfigService } from '@ad-engine/core';
import { DiProcess } from '@ad-engine/pipeline';
import { getServicesBaseURL, outboundTrafficRestrict } from '@ad-engine/utils';
import { Injectable } from '@wikia/dependency-injection';
import { MetricReporter } from '../tracking/metric-reporter';
import { metricReporterSender } from '../tracking/metric-reporter/metric-reporter-sender';

@Injectable()
export class MetricReporterSetup implements DiProcess {
	constructor(private instantConfig: InstantConfigService) {}

	async execute() {
		const serviceUrl = getServicesBaseURL() || '';
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

		if (outboundTrafficRestrict.isOutboundTrafficAllowed('monitoring-default')) {
			metricReporterSender.activate();
		}
		new MetricReporter(metricReporterSender).initialise();
	}
}
