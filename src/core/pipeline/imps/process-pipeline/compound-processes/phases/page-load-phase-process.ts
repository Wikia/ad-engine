import { Container, Injectable } from '@wikia/dependency-injection';
import { context, InstantConfigService } from '../../../../../services';
import { ProcessPipeline } from '../../process-pipeline';
import {
	CompoundProcess,
	CompoundProcessStep,
	ProcessStepUnion,
} from '../../process-pipeline-types';

const DEFAULT_WAIT_FOR_PAGE_LOAD_TIMEOUT = 1500;
const DEFAULT_IMPATIENT_WAIT_FOR_PAGE_LOAD_TIMEOUT = 1200;

interface PageLoadPhaseIcbmStructure {
	wait: boolean;
	timeout: number;
}

class PageLoadPhaseProcessBase<T> implements CompoundProcess<ProcessStepUnion<T>[]> {
	private fired = false;
	private timeoutId: NodeJS.Timeout | null = null;

	constructor(private container: Container, private config: PageLoadPhaseIcbmStructure) {}

	execute(payload: ProcessStepUnion<T>[]): Promise<void> | void {
		const pipeline = this.container.get(ProcessPipeline);

		if (!this.config.wait) {
			return pipeline.add(...payload).execute();
		}

		if (document.readyState === 'complete') {
			console.debug('[AEPERF] window.onload already fired');
			return this.addExecutePipeline(pipeline, payload);
		}

		this.runSafeTimeout(pipeline, payload);
		window.onload = () => {
			console.debug('[AEPERF] window.onload event fired');
			this.killSafeTimeout();
			return this.addExecutePipeline(pipeline, payload);
		};
	}

	private runSafeTimeout(pipeline: ProcessPipeline, payload: ProcessStepUnion<T>[]): void {
		this.timeoutId = setTimeout(() => {
			console.debug('[AEPERF] window.onload not fired');
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
		return pipeline.add(...payload).execute();
	}
}

@Injectable({ scope: 'Transient' })
class PageLoadPhaseProcess<T>
	extends PageLoadPhaseProcessBase<T>
	implements CompoundProcess<ProcessStepUnion<T>[]>
{
	constructor(container: Container, instantConfigService: InstantConfigService) {
		super(
			container,
			instantConfigService.get('pageLoadPhase', {
				wait: true,
				timeout:
					context.get('options.phases.pageLoadedTimeout') || DEFAULT_WAIT_FOR_PAGE_LOAD_TIMEOUT,
			}),
		);
	}
}

@Injectable({ scope: 'Transient' })
class ImpatientPageLoadPhaseProcess<T>
	extends PageLoadPhaseProcessBase<T>
	implements CompoundProcess<ProcessStepUnion<T>[]>
{
	constructor(container: Container) {
		super(container, {
			wait: true,
			timeout:
				context.get('options.phases.impatientPageLoadedTimeout') ||
				DEFAULT_IMPATIENT_WAIT_FOR_PAGE_LOAD_TIMEOUT,
		});
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

export function impatientPageLoadPhase<T>(
	...steps: ProcessStepUnion<T>[]
): CompoundProcessStep<ProcessStepUnion<T>[]> {
	return {
		process: ImpatientPageLoadPhaseProcess,
		payload: steps,
	};
}
