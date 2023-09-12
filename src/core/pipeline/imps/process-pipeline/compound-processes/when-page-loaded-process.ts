import { Container, Injectable } from '@wikia/dependency-injection';
import { InstantConfigService } from '../../../../services';
import { ProcessPipeline } from '../process-pipeline';
import { CompoundProcess, CompoundProcessStep, ProcessStepUnion } from '../process-pipeline-types';

@Injectable({ scope: 'Transient' })
class WhenPageLoadedProcess<T> implements CompoundProcess<ProcessStepUnion<T>[]> {
	constructor(private container: Container, private instantConfigService: InstantConfigService) {}

	execute(payload: ProcessStepUnion<T>[]): Promise<void> | void {
		const waitingForPageLoadedActivated = this.instantConfigService.get('pageLoadWait', false);
		const pipeline = this.container.get(ProcessPipeline);

		if (!waitingForPageLoadedActivated || document.readyState === 'complete') {
			return pipeline.add(...payload).execute();
		}

		window.onload = () => {
			return pipeline.add(...payload).execute();
		};
	}
}

export function whenPageLoaded<T>(
	...steps: ProcessStepUnion<T>[]
): CompoundProcessStep<ProcessStepUnion<T>[]> {
	return {
		process: WhenPageLoadedProcess,
		payload: steps,
	};
}
