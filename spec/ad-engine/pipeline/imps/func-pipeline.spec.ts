import { FuncPipeline, FuncPipelineStep } from '@wikia/ad-engine';
import { createSandbox } from 'sinon';
import { PipelineTestSuite } from './pipeline-test-suite';

describe('FuncPipeline', () => {
	const sandbox = createSandbox();
	const spys = PipelineTestSuite.generateSpys(sandbox);
	let pipelineTestSuite: PipelineTestSuite<FuncPipelineStep<number>>;

	const firstStep: FuncPipelineStep<number> = (payload, next) => {
		spys.firstBefore(payload);
		return next(payload + 1).then((result) => {
			spys.firstAfter(result);
			return result;
		});
	};
	const secondStep: FuncPipelineStep<any> = async (payload, next) => {
		spys.secondBefore(payload);
		const result = await next(payload + 1);
		spys.secondAfter(result);
		return result;
	};
	const finalStep: FuncPipelineStep<any> = async (payload) => {
		spys.final(payload);
		return payload + 1;
	};

	beforeEach(() => {
		pipelineTestSuite = new PipelineTestSuite<FuncPipelineStep<number>>(
			sandbox,
			spys,
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
});
