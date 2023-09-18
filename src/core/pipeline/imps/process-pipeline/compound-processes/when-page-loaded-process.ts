import { Container, Injectable } from '@wikia/dependency-injection';
import { MetricReporter } from '../../../../../platforms/shared';
import { InstantConfigService } from '../../../../services';
import { ProcessPipeline } from '../process-pipeline';
import { CompoundProcess, CompoundProcessStep, ProcessStepUnion } from '../process-pipeline-types';

const DEFAULT_WAIT_FOR_PAGE_LOAD_TIMEOUT = 1500;

@Injectable({ scope: 'Transient' })
class WhenPageLoadedProcess<T> implements CompoundProcess<ProcessStepUnion<T>[]> {
	private fired = false;
	private timeoutId: NodeJS.Timeout | null = null;

	constructor(private container: Container, private instantConfigService: InstantConfigService) {}

	execute(payload: ProcessStepUnion<T>[]): Promise<void> | void {
		const waitingForPageLoadedActivated = this.instantConfigService.get('pageLoadWait', false);
		const pipeline = this.container.get(ProcessPipeline);

		if (!waitingForPageLoadedActivated) {
			new MetricReporter().setTrackingVariant('plw-disabled').trackLoadTimeVarianted();
			return pipeline.add(...payload).execute();
		}

		if (document.readyState === 'complete') {
			this.addExecutePipeline(pipeline, payload);
		}

		this.runSafeTimeout(pipeline, payload);
		window.onload = () => {
			this.killSafeTimeout();
			this.addExecutePipeline(pipeline, payload);
		};
	}

	private runSafeTimeout(pipeline: ProcessPipeline, payload: ProcessStepUnion<T>[]): void {
		const icbmTimeout = this.instantConfigService.get(
			'pageLoadWaitTimeout',
			DEFAULT_WAIT_FOR_PAGE_LOAD_TIMEOUT,
		);
		this.timeoutId = setTimeout(() => {
			this.addExecutePipeline(pipeline, payload);
		}, icbmTimeout);
	}

	private killSafeTimeout(): void {
		clearTimeout(this.timeoutId);
	}

	private addExecutePipeline(
		pipeline: ProcessPipeline,
		payload: ProcessStepUnion<T>[],
	): Promise<void> | void {
		if (this.fired) {
			return;
		}

		this.fired = true;
		new MetricReporter().setTrackingVariant('plw-enabled').trackLoadTimeVarianted();
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
