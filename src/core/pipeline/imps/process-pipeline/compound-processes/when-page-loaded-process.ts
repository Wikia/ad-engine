import { Container, Injectable } from '@wikia/dependency-injection';
import { MetricReporter } from '../../../../../platforms/shared';
import { InstantConfigService } from '../../../../services';
import { ProcessPipeline } from '../process-pipeline';
import { CompoundProcess, CompoundProcessStep, ProcessStepUnion } from '../process-pipeline-types';

const WAIT_FOR_PAGE_LOAD_TIMEOUT = 2000;

@Injectable({ scope: 'Transient' })
class WhenPageLoadedProcess<T> implements CompoundProcess<ProcessStepUnion<T>[]> {
	private fired = false;

	constructor(private container: Container, private instantConfigService: InstantConfigService) {}

	execute(payload: ProcessStepUnion<T>[]): Promise<void> | void {
		const waitingForPageLoadedActivated = this.instantConfigService.get('pageLoadWait', false);
		const pipeline = this.container.get(ProcessPipeline);

		if (!waitingForPageLoadedActivated) {
			new MetricReporter().trackLoadTimeVarianted('plw-disabled');
			return pipeline.add(...payload).execute();
		}

		if (document.readyState === 'complete') {
			this.addExecutePipeline(pipeline, payload);
		}

		this.runSafeTimeout(pipeline, payload);
		window.onload = () => {
			this.addExecutePipeline(pipeline, payload);
		};
	}

	private runSafeTimeout(pipeline: ProcessPipeline, payload: ProcessStepUnion<T>[]): void {
		setTimeout(() => {
			this.addExecutePipeline(pipeline, payload);
		}, WAIT_FOR_PAGE_LOAD_TIMEOUT);
	}

	private addExecutePipeline(
		pipeline: ProcessPipeline,
		payload: ProcessStepUnion<T>[],
	): Promise<void> | void {
		if (this.fired) {
			return;
		}

		this.fired = true;
		new MetricReporter().trackLoadTimeVarianted('plw-enabled');
		return pipeline.add(...payload).execute();
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
