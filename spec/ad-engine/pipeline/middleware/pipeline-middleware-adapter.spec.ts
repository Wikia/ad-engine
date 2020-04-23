import { Middleware } from '@wikia/ad-engine';
import { PipelineMiddlewareAdapter } from '@wikia/ad-engine/pipeline/middleware/pipeline-middleware-adapter';
import { expect } from 'chai';
import { createSandbox } from 'sinon';

describe('PipelineMiddlewareAdapter', () => {
	const sandbox = createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	it('should execute step and return original value', async () => {
		const spy = sandbox.spy();
		const adapter = new PipelineMiddlewareAdapter<{ number: number }>();
		const middleware: Middleware<{ number: number }> = ({ number }, next) => {
			next({ number: number + 1 });
		};
		const result = await adapter.execute(middleware, { number: 10 }, spy);

		expect(result).to.deep.equal({ number: 10 });
		expect(spy.calledOnce).to.equal(true);
		expect(spy.getCall(0).args[0]).to.deep.equal({ number: 11 });
	});
});
