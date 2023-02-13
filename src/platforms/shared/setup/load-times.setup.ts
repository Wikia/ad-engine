import { DiProcess } from '@wikia/ad-engine';
import { injectable } from 'tsyringe';
import { LoadTimesTracker } from '../tracking/load-times-tracker';

@injectable()
export class LoadTimesSetup implements DiProcess {
	execute(): void {
		LoadTimesTracker.make();
	}
}
