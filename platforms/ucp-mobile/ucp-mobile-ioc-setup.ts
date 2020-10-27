import { TrackingSetup, UcpTargetingSetup } from '@platforms/shared';
import {
	bidderTrackingMiddleware,
	DiProcess,
	slotBiddersTrackingMiddleware,
	slotBillTheLizardStatusTrackingMiddleware,
	slotPropertiesTrackingMiddleware,
	slotTrackingMiddleware,
} from '@wikia/ad-engine';
import { Container, Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpMobileIocSetup implements DiProcess {
	constructor(private container: Container) {}

	async execute(): Promise<void> {
		this.container.bind(UcpTargetingSetup.skin('fandommobile'));

		TrackingSetup.provideMiddlewares({
			slotTrackingMiddlewares: [
				slotPropertiesTrackingMiddleware,
				slotBiddersTrackingMiddleware,
				slotBillTheLizardStatusTrackingMiddleware,
				slotTrackingMiddleware,
			],
			bidderTrackingMiddlewares: [bidderTrackingMiddleware],
		}).forEach((binder) => this.container.bind(binder));
	}
}
