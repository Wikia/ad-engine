import { TrackingSetup, UcpTargetingSetup } from '@platforms/shared';
import {
	bidderTrackingMiddleware,
	DiProcess,
	slotBiddersTrackingMiddleware,
	slotPropertiesTrackingMiddleware,
	pagePropertiesTrackingMiddleware,
	slotTrackingMiddleware,
} from '@wikia/ad-engine';
import { Container, Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpMobileIocSetup implements DiProcess {
	constructor(private container: Container) {}

	async execute(): Promise<void> {
		this.container.bind(UcpTargetingSetup.skin('ucp_mobile'));

		TrackingSetup.provideMiddlewares({
			slotTrackingMiddlewares: [
				slotPropertiesTrackingMiddleware,
				pagePropertiesTrackingMiddleware,
				slotBiddersTrackingMiddleware,
				slotTrackingMiddleware,
			],
			bidderTrackingMiddlewares: [bidderTrackingMiddleware],
		}).forEach((binder) => this.container.bind(binder));
	}
}
