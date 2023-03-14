import { context, DiProcess, InstantConfigService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MonitoringSetup implements DiProcess {
	constructor(private instantConfig: InstantConfigService) {}

	async execute() {
		context.set('services.monitoring.local', this.isLocal());
		context.set('services.monitoring.endpoint', this.getServiceBaseURL());
		context.set('services.monitoring.service', this.getServiceName());
		context.set(
			'services.monitoring.threshold',
			this.instantConfig.get('icMonitorTrafficThreshold'),
		);
	}

	private isLocal(): boolean {
		const urlSearchParamsEntries = new URLSearchParams(window.location.search).entries();
		const queryParams = Object.fromEntries(urlSearchParamsEntries);

		return queryParams.adengine_version === 'local';
	}

	private getServiceName(): string {
		return this.isLocal() ? '' : 'icbm';
	}

	private getServiceBaseURL(): string {
		return this.isLocal() ? 'http://localhost:8080' : utils.getServicesBaseURL();
	}
}
