import { TrackingSetup, UcpTargetingSetup } from '@platforms/shared';
import {
	bidderTrackingMiddleware,
	context,
	DiProcess,
	FOOTER,
	InstantConfigService,
	NAVBAR,
	PAGE,
	slotBiddersTrackingMiddleware,
	slotBillTheLizardStatusTrackingMiddleware,
	slotPropertiesTrackingMiddleware,
	slotTrackingMiddleware,
} from '@wikia/ad-engine';
import { Container, Injectable } from '@wikia/dependency-injection';
import { set } from 'lodash';
import * as fallbackInstantConfig from './fallback-config.json';

@Injectable()
export class UcpIocSetup implements DiProcess {
	constructor(private container: Container) {}

	async execute(): Promise<void> {
		set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);

		this.container.bind(InstantConfigService).value(await InstantConfigService.init());
		this.container.bind(UcpTargetingSetup.skin('oasis'));
		this.container.bind(NAVBAR).value(document.querySelector('.wds-global-navigation-wrapper'));
		this.container.bind(FOOTER).value(document.querySelector('.wds-global-footer'));
		this.container.bind(PAGE).value(document.body);

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
