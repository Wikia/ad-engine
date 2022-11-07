import { Injectable } from '@wikia/dependency-injection';
import { ProcessPipeline } from '@wikia/ad-engine';

@Injectable()
export class PlayerOnePlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.execute();
	}
}
