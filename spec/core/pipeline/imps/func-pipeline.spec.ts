import { FuncPipeline, FuncPipelineStep } from '@wikia/core';
import { PipelineTestSuite } from './pipeline-test-suite';

describe('FuncPipeline', () => {
	let pipelineTestSuite: PipelineTestSuite<FuncPipelineStep<number>>;

	beforeEach(() => {
		const spies = PipelineTestSuite.generateSpies(global.sandbox);

		const firstStep: FuncPipelineStep<number> = (payload, next) => {
			spies.firstBefore(payload);
			return next(payload + 1).then((result) => {
				spies.firstAfter(result);
				return result;
			});
		};
		const secondStep: FuncPipelineStep<any> = async (payload, next) => {
			spies.secondBefore(payload);
			const result = await next(payload + 1);
			spies.secondAfter(result);
			return result;
		};
		const finalStep: FuncPipelineStep<any> = async (payload) => {
			spies.final(payload);
			return payload + 1;
		};

		pipelineTestSuite = new PipelineTestSuite<FuncPipelineStep<number>>(
			global.sandbox,
			spies,
			new FuncPipeline<number>(),
			{ first: firstStep, second: secondStep, final: finalStep },
		);
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
