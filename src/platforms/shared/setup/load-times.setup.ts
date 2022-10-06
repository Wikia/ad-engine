import { Injectable } from '@wikia/dependency-injection';
import { DiProcess } from '@wikia/ad-engine';
import { LoadTimesTracker } from '../tracking/load-times-tracker';

@Injectable()
export class LoadTimesSetup implements DiProcess {
	execute(): void {
		LoadTimesTracker.make();
	}
}
