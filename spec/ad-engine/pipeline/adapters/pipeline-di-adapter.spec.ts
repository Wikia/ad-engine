import { PipelineDiAdapter, PipelineDiStep } from '@wikia/ad-engine';
import { PipelineNext } from '@wikia/ad-engine/pipeline/pipeline-types';
import { Container } from '@wikia/dependency-injection';
import { expect } from 'chai';
import { createSandbox, SinonSpy } from 'sinon';

describe('PipelineDiAdapter', () => {
	const sandbox = createSandbox();
	let nextMock: SinonSpy;

	class ExampleStep implements PipelineDiStep<{ number: number }> {
		execute(
			payload: { number: number },
			next?: PipelineNext<{ number: number }>,
		): Promise<{ number: number }> {
			return next({ number: payload.number + 1 });
		}
	}

	beforeEach(() => {
		nextMock = sandbox.mock().callsFake(async (val) => val);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should execute step and return final value', async () => {
		const container = new Container();
		const adapter = new PipelineDiAdapter<{ number: number }>(container);
		const result = await adapter.execute(ExampleStep, { number: 10 }, nextMock);

		expect(result).to.deep.equal({ number: 11 }, 'a');
		expect(nextMock.calledOnce).to.equal(true, 'b');
		expect(nextMock.getCall(0).args[0]).to.deep.equal({ number: 11 }, 'c');
	});
});
