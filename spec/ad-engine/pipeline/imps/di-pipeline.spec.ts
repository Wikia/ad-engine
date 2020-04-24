import { DiPipeline, DiPipelineStep } from '@wikia/ad-engine';
import { PipelineNext } from '@wikia/ad-engine/pipeline/pipeline-types';
import { Container } from '@wikia/dependency-injection';
import { expect } from 'chai';
import { createSandbox } from 'sinon';

describe('DiPipeline', () => {
	const sandbox = createSandbox();

	class ExampleStep implements DiPipelineStep<{ number: number }> {
		execute(
			payload: { number: number },
			next?: PipelineNext<{ number: number }>,
		): Promise<{ number: number }> {
			return next({ number: payload.number + 1 });
		}
	}

	afterEach(() => {
		sandbox.restore();
	});

	it('should execute step and return final value', async () => {
		const container = new Container();
		const pipeline = container.get<DiPipeline<{ number: number }>>(DiPipeline);

		pipeline.add(ExampleStep);

		const result = await pipeline.execute({ number: 10 });

		expect(result).to.deep.equal({ number: 11 }, 'a');
	});
});
