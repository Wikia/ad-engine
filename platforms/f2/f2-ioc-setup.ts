import { TrackingSetup } from '@platforms/shared';
import {
	communicationService,
	DiProcess,
	ofType,
	slotPropertiesTrackingMiddleware,
	slotTrackingMiddleware,
} from '@wikia/ad-engine';
import { Container, Injectable } from '@wikia/dependency-injection';
import { take } from 'rxjs/operators';
import { F2_ENV, f2Ready } from './setup-f2';
import { getF2StateBinder } from './utils/f2-state-binder';

@Injectable()
export class F2IocSetup implements DiProcess {
	constructor(private container: Container) {}

	async execute(): Promise<void> {
		this.container
			.bind(F2_ENV)
			.value(await communicationService.action$.pipe(ofType(f2Ready), take(1)).toPromise());
		this.container.bind(getF2StateBinder());

		TrackingSetup.provideMiddlewares({
			slotTrackingMiddlewares: [slotPropertiesTrackingMiddleware, slotTrackingMiddleware],
		}).forEach((binder) => this.container.bind(binder));
	}
}
