import { DiProcess, LoadTimesTracker } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class LoadTimesSetup implements DiProcess {
	execute(): void {
		LoadTimesTracker.make();
	}
}
