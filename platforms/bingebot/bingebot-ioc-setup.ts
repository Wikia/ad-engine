import { TrackingSetup } from '@platforms/shared';
import {
	DiProcess,
	slotPropertiesTrackingMiddleware,
	slotTrackingMiddleware,
} from '@wikia/ad-engine';
import { Container, Injectable } from '@wikia/dependency-injection';
import { BingeBotTargetingSetup } from './setup/context/targeting/bingebot-targeting.setup';

@Injectable()
export class BingeBotIocSetup implements DiProcess {
	constructor(private container: Container) {}

	async execute(): Promise<void> {
		this.container.bind(BingeBotTargetingSetup.skin('bingebot'));

		TrackingSetup.provideMiddlewares({
			slotTrackingMiddlewares: [slotPropertiesTrackingMiddleware, slotTrackingMiddleware],
		}).forEach((binder) => this.container.bind(binder));
	}
}
