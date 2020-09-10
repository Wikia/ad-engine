import { TrackingSetup, UcpTargetingSetup } from '@platforms/shared';
import {
	bidderTrackingMiddleware,
	DiProcess,
	slotBiddersTrackingMiddleware,
	slotPropertiesTrackingMiddleware,
	slotTrackingMiddleware,
} from '@wikia/ad-engine';
import { Container, Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpMinervaIocSetup implements DiProcess {
	constructor(private container: Container) {}

	execute(): void {
		this.container.bind(UcpTargetingSetup.skin('minerva'));

		TrackingSetup.provideMiddlewares({
			slotTrackingMiddlewares: [
				slotPropertiesTrackingMiddleware,
				slotBiddersTrackingMiddleware,
				slotTrackingMiddleware,
			],
			bidderTrackingMiddlewares: [bidderTrackingMiddleware],
		}).forEach((binder) => this.container.bind(binder));
	}
}
