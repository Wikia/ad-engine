import { communicationService, DiProcess, ofType } from '@wikia/ad-engine';
import { take } from 'rxjs/operators';
import { DependencyContainer, injectable } from 'tsyringe';
import { f2Ready, F2_ENV } from './setup-f2';
import { getF2StateBinder } from './utils/f2-state-binder';

@injectable()
export class F2IocSetup implements DiProcess {
	constructor(private container: DependencyContainer) {}

	async execute(): Promise<void> {
		this.container.register(F2_ENV, {
			useValue: await communicationService.action$.pipe(ofType(f2Ready), take(1)).toPromise(),
		});
		this.container.register(...getF2StateBinder());
	}
}
