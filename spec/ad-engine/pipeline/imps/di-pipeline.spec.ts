import { DiPipeline, DiPipelineStep, Type } from '@wikia/ad-engine';
import { PipelineNext } from '@wikia/ad-engine/pipeline/pipeline-types';
import { Container } from '@wikia/dependency-injection';
import { createSandbox } from 'sinon';
import { PipelineTestSuite } from './pipeline-test-suite';

describe('DiPipeline', () => {
	const sandbox = createSandbox();
	const spys = PipelineTestSuite.generateSpys(sandbox);
	let pipelineTestSuite: PipelineTestSuite<Type<DiPipelineStep<number>>>;

	class FirstStep implements DiPipelineStep<number> {
		execute(payload: number, next?: PipelineNext<number>): Promise<number> {
			spys.firstBefore(payload);
			return next(payload + 1).then((result) => {
				spys.firstAfter(result);
				return result;
			});
		}
	}

	class SecondStep implements DiPipelineStep<number> {
		async execute(payload: number, next?: PipelineNext<number>): Promise<number> {
			spys.secondBefore(payload);
			const result = await next(payload + 1);
			spys.secondAfter(result);
			return result;
		}
	}

	class FinalStep implements DiPipelineStep<number> {
		async execute(payload: number): Promise<number> {
			spys.final(payload);
			return payload + 1;
		}
	}

	beforeEach(() => {
		const container = new Container();

		pipelineTestSuite = new PipelineTestSuite<Type<DiPipelineStep<number>>>(
			sandbox,
			spys,
			container.get<DiPipeline<number>>(DiPipeline),
			{ first: FirstStep, second: SecondStep, final: FinalStep },
		);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should execute step and return final value', async () => {
		await pipelineTestSuite.executeWithoutFinal();
	});
});
