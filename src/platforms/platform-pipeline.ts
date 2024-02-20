import { DiProcess, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
// eslint-disable-next-line no-restricted-imports
import { PlatformSetup } from './shared/setup/platform.setup';

@Injectable()
export class PlatformPipeline implements DiProcess {
	constructor(private pipeline: ProcessPipeline) {}
	execute(): void {
		this.pipeline.add(PlatformSetup);
		this.pipeline.execute();
	}
}
