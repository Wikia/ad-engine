import { Injectable } from '@wikia/dependency-injection';
import { DiProcess, LoadTimesService } from '@wikia/ad-engine';

@Injectable()
export class LoadTimesSetup implements DiProcess {
	execute(): void {
		LoadTimesService.make();
	}
}
