import { BillTheLizardSetup, PageTracker } from '@platforms/shared';
import {
	billTheLizard,
	billTheLizardEvents,
	context,
	eventService,
	InstantConfigService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

interface BillTheLizardProject {
	name: string;
	countries?: string[];
	dfp_targeting?: boolean;
}

interface BillTheLizardConfig {
	projects?: BillTheLizardProject[];
	timeout?: number;
}

@Injectable()
export class UcpBillTheLizardSetup implements BillTheLizardSetup {
	constructor(private instantConfig: InstantConfigService, private pageTracker: PageTracker) {}

	execute(): void {
		const config: BillTheLizardConfig = this.instantConfig.get('wgAdDriverBillTheLizardConfig', {});
		const now = new Date();

		context.set('services.billTheLizard.parameters', {
			vcr: {
				h: now.getHours(),
				pv: Math.min(30, context.get('targeting.pv') || 1),
				pv_global: Math.min(40, window.pvNumberGlobal || 1),
				ref: context.get('targeting.ref') || null,
			},
		});
		context.set('services.billTheLizard.projects', config.projects);
		context.set('services.billTheLizard.timeout', config.timeout);

		const servicesDomain: string = context.get('wiki.wgServicesExternalDomain');

		if (servicesDomain) {
			context.set('services.billTheLizard.host', servicesDomain.replace(/\/$/, ''));
		}

		this.configureProjects();
		this.configureTracking();
	}

	private configureProjects(): void {
		if (context.get('custom.hasFeaturedVideo')) {
			billTheLizard.projectsHandler.enable('queen_of_hearts');
			billTheLizard.projectsHandler.enable('vcr');
		}
	}

	private configureTracking(): void {
		eventService.on(billTheLizardEvents.BILL_THE_LIZARD_REQUEST, (event) => {
			let propName = 'btl_request';
			if (event.callId !== undefined) {
				propName = `${propName}_${event.callId}`;
			}

			this.pageTracker.trackProp(propName, event.query);
		});

		eventService.on(billTheLizardEvents.BILL_THE_LIZARD_RESPONSE, (event) => {
			let propName = 'btl_response';
			if (event.callId !== undefined) {
				propName = `${propName}_${event.callId}`;
			}

			this.pageTracker.trackProp(propName, event.response);
		});
	}
}
