import { DiPipeline, DiPipelineStep, Type } from '@wikia/ad-engine';
import { PipelineNext } from '@wikia/ad-engine/pipeline/pipeline-types';
import { Container } from '@wikia/dependency-injection';
import { createSandbox } from 'sinon';
import { PipelineTestSuite } from './pipeline-test-suite';

describe('DiPipeline', () => {
	const sandbox = createSandbox();
	const spies = PipelineTestSuite.generateSpies(sandbox);
	let pipelineTestSuite: PipelineTestSuite<Type<DiPipelineStep<number>>>;

	class FirstStep implements DiPipelineStep<number> {
		execute(payload: number, next?: PipelineNext<number>): Promise<number> {
			spies.firstBefore(payload);
			return next(payload + 1).then((result) => {
				spies.firstAfter(result);
				return result;
			});
		}
	}

	class SecondStep implements DiPipelineStep<number> {
		async execute(payload: number, next?: PipelineNext<number>): Promise<number> {
			spies.secondBefore(payload);
			const result = await next(payload + 1);
			spies.secondAfter(result);
			return result;
		}
	}

	class FinalStep implements DiPipelineStep<number> {
		async execute(payload: number): Promise<number> {
			spies.final(payload);
			return payload + 1;
		}
	}

	beforeEach(() => {
		const container = new Container();

		pipelineTestSuite = new PipelineTestSuite<Type<DiPipelineStep<number>>>(
			sandbox,
			spies,
			container.get<DiPipeline<number>>(DiPipeline),
			{ first: FirstStep, second: SecondStep, final: FinalStep },
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
