import { Container, Injectable } from '@wikia/dependency-injection';
import { ProcessPipeline } from '../../process-pipeline';
import {
	CompoundProcess,
	CompoundProcessStep,
	ProcessStepUnion,
} from '../../process-pipeline-types';

const DEFAULT_WAIT_FOR_DOM_CONTENT_LOADED_TIMEOUT = 500;

interface DOMContentLoadedPhaseIcbmStructure {
	timeout: number;
}

@Injectable({ scope: 'Transient' })
class DOMContentLoadedPhaseProcess<T> implements CompoundProcess<ProcessStepUnion<T>[]> {
	private fired = false;
	private timeoutId: NodeJS.Timeout | null = null;
	private readonly config: DOMContentLoadedPhaseIcbmStructure;

	// This phase is being used when loading ICBM variables, therefore InstantConfig cannot be used here.
	constructor(private container: Container) {
		this.config = {
			timeout: DEFAULT_WAIT_FOR_DOM_CONTENT_LOADED_TIMEOUT,
		};
	}

	execute(payload: ProcessStepUnion<T>[]): Promise<void> | void {
		const pipeline = this.container.get(ProcessPipeline);

		if (document.readyState !== 'loading') {
			console.debug('[AEPERF] DOMContentLoaded already fired');
			return this.addExecutePipeline(pipeline, payload);
		}

		this.runSafeTimeout(pipeline, payload);
		document.addEventListener('DOMContentLoaded', () => {
			console.debug('[AEPERF] DOMContentLoaded event fired');
			this.killSafeTimeout();
			return this.addExecutePipeline(pipeline, payload);
		});
	}

	private runSafeTimeout(pipeline: ProcessPipeline, payload: ProcessStepUnion<T>[]): void {
		this.timeoutId = setTimeout(() => {
			console.debug('[AEPERF] DOMContentLoaded not fired');
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
			console.log('AEPERF fired');
			return;
		}

		this.fired = true;
		return pipeline.add(...payload).execute();
	}
}

export function domContentLoadedPhase<T>(
	...steps: ProcessStepUnion<T>[]
): CompoundProcessStep<ProcessStepUnion<T>[]> {
	return {
		process: DOMContentLoadedPhaseProcess,
		payload: steps,
	};
}
