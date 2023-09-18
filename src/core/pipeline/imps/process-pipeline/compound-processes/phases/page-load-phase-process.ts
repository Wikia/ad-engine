import { Container, Injectable } from '@wikia/dependency-injection';
import { MetricReporter } from '../../../../../../platforms/shared';
import { InstantConfigService } from '../../../../../services';
import { ProcessPipeline } from '../../process-pipeline';
import {
	CompoundProcess,
	CompoundProcessStep,
	ProcessStepUnion,
} from '../../process-pipeline-types';

const DEFAULT_WAIT_FOR_PAGE_LOAD_TIMEOUT = 1500;

interface pageLoadPhaseIcbmStructure {
	wait: boolean;
	timeout: number;
}

@Injectable({ scope: 'Transient' })
class PageLoadPhaseProcess<T> implements CompoundProcess<ProcessStepUnion<T>[]> {
	private fired = false;
	private timeoutId: NodeJS.Timeout | null = null;
	private readonly config: pageLoadPhaseIcbmStructure;

	constructor(private container: Container, instantConfigService: InstantConfigService) {
		this.config = instantConfigService.get('pageLoadPhase', {
			wait: false,
			timeout: DEFAULT_WAIT_FOR_PAGE_LOAD_TIMEOUT,
		});
	}

	execute(payload: ProcessStepUnion<T>[]): Promise<void> | void {
		const pipeline = this.container.get(ProcessPipeline);

		if (!this.config.wait) {
			new MetricReporter().setTrackingVariant('plw-disabled').trackLoadTimeVarianted();
			return pipeline.add(...payload).execute();
		}

		if (document.readyState === 'complete') {
			return this.addExecutePipeline(pipeline, payload);
		}

		this.runSafeTimeout(pipeline, payload);
		window.onload = () => {
			this.killSafeTimeout();
			return this.addExecutePipeline(pipeline, payload);
		};
	}

	private runSafeTimeout(pipeline: ProcessPipeline, payload: ProcessStepUnion<T>[]): void {
		this.timeoutId = setTimeout(() => {
			return this.addExecutePipeline(pipeline, payload);
		}, this.config.timeout);
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

export function pageLoadPhase<T>(
	...steps: ProcessStepUnion<T>[]
): CompoundProcessStep<ProcessStepUnion<T>[]> {
	return {
		process: PageLoadPhaseProcess,
		payload: steps,
	};
}
