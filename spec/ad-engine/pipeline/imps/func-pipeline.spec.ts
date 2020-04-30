import { FuncPipeline, FuncPipelineStep } from '@wikia/ad-engine';
import { createSandbox } from 'sinon';
import { PipelineTestSuite } from './pipeline-test-suite';

describe('FuncPipeline', () => {
	const sandbox = createSandbox();
	const spies = PipelineTestSuite.generateSpies(sandbox);
	let pipelineTestSuite: PipelineTestSuite<FuncPipelineStep<number>>;

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

	beforeEach(() => {
		pipelineTestSuite = new PipelineTestSuite<FuncPipelineStep<number>>(
			sandbox,
			spies,
			new FuncPipeline<number>(),
			{ first: firstStep, second: secondStep, final: finalStep },
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
