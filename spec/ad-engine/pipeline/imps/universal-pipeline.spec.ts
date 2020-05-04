import {
	DiPipelineStep,
	FuncPipelineStep,
	UniversalPipeline,
	UniversalPipelineStep,
} from '@wikia/ad-engine';
import { PipelineNext } from '@wikia/ad-engine/pipeline/pipeline-types';
import { Container } from '@wikia/dependency-injection';
import { createSandbox } from 'sinon';
import { PipelineTestSuite } from './pipeline-test-suite';

describe('UniversalPipeline', () => {
	const sandbox = createSandbox();
	const spies = PipelineTestSuite.generateSpies(sandbox);
	let pipelineTestSuite: PipelineTestSuite<UniversalPipelineStep<number>>;

	class FirstStep implements DiPipelineStep<number> {
		execute(payload: number, next?: PipelineNext<number>): Promise<number> {
			spies.firstBefore(payload);
			return next(payload + 1).then((result) => {
				spies.firstAfter(result);
				return result;
			});
		}
	}

	const secondStep: FuncPipelineStep<any> = async (payload, next) => {
		spies.secondBefore(payload);
		const result = await next(payload + 1);
		spies.secondAfter(result);
		return result;
	};

	class FinalStep implements DiPipelineStep<number> {
		async execute(payload: number): Promise<number> {
			spies.final(payload);
			return payload + 1;
		}
	}

	beforeEach(() => {
		const container = new Container();

		pipelineTestSuite = new PipelineTestSuite<UniversalPipelineStep<number>>(
			sandbox,
			spies,
			container.get<UniversalPipeline<number>>(UniversalPipeline),
			{ first: FirstStep, second: secondStep, final: FinalStep },
		);
	});

	afterEach(() => {
		sandbox.resetHistory();
	});

	it('should execute without final', async () => {
		await pipelineTestSuite.executeWithoutFinal();
	});

	it('should execute with final', async () => {
		await pipelineTestSuite.executeWithFinal();
	});

	it('should execute with cutoff', async () => {
		await pipelineTestSuite.executeWithCutoff();
	});
});
