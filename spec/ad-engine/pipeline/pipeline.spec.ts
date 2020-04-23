import { Pipeline } from '@wikia/ad-engine/pipeline/pipeline';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { PipelineAdapterStub, PipelineStepStub } from './pipeline-adapter.stub';

describe('Pipeline', () => {
	const sandbox = createSandbox();
	let pipeline: Pipeline<PipelineStepStub<any>, any>;

	beforeEach(() => {
		pipeline = new Pipeline(new PipelineAdapterStub());
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should execute in order', async () => {
		const firstBeforeSpy = sandbox.spy();
		const firstAfterSpy = sandbox.spy();
		const secondBeforeSpy = sandbox.spy();
		const secondAfterSpy = sandbox.spy();
		const firstStep: PipelineStepStub<any> = (payload, next) => {
			firstBeforeSpy(payload);
			return next(payload + 1).then((result) => {
				firstAfterSpy(result);
				return result;
			});
		};
		const secondStep: PipelineStepStub<any> = async (payload, next) => {
			secondBeforeSpy(payload);
			const result = await next(payload + 1);
			secondAfterSpy(result);
			return result;
		};

		const result = await pipeline.add(firstStep, secondStep).execute(10);

		expect(result).to.equal(12);
		expect(firstBeforeSpy.getCall(0).args[0]).to.equal(10);
		expect(firstAfterSpy.getCall(0).args[0]).to.equal(12);
		expect(secondBeforeSpy.getCall(0).args[0]).to.equal(11);
		expect(secondAfterSpy.getCall(0).args[0]).to.equal(12);
		sandbox.assert.callOrder(firstBeforeSpy, secondBeforeSpy, secondAfterSpy, firstAfterSpy);
	});
});
