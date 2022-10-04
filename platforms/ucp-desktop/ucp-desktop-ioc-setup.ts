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
export class UcpDesktopIocSetup implements DiProcess {
	constructor(private container: Container) {}

	execute(): void {
		this.container.bind(UcpTargetingSetup.skin('ucp_desktop'));

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
