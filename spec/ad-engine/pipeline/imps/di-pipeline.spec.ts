import { DiPipeline, DiPipelineStep } from '@wikia/ad-engine';
import { PipelineNext } from '@wikia/ad-engine/pipeline/pipeline-types';
import { Container } from '@wikia/dependency-injection';
import { expect } from 'chai';
import { createSandbox, SinonSpy } from 'sinon';

describe('DiPipeline', () => {
	const sandbox = createSandbox();
	let pipeline: DiPipeline<number>;
	let firstBeforeSpy: SinonSpy;
	let firstAfterSpy: SinonSpy;
	let secondBeforeSpy: SinonSpy;
	let secondAfterSpy: SinonSpy;

	class FirstStep implements DiPipelineStep<number> {
		execute(payload: number, next?: PipelineNext<number>): Promise<number> {
			firstBeforeSpy(payload);
			return next(payload + 1).then((result) => {
				firstAfterSpy(result);
				return result;
			});
		}
	}

	class SecondStep implements DiPipelineStep<number> {
		async execute(payload: number, next?: PipelineNext<number>): Promise<number> {
			secondBeforeSpy(payload);
			const result = await next(payload + 1);
			secondAfterSpy(result);
			return result;
		}
	}

	beforeEach(() => {
		const container = new Container();

		pipeline = container.get<DiPipeline<number>>(DiPipeline);
		firstBeforeSpy = sandbox.spy();
		firstAfterSpy = sandbox.spy();
		secondBeforeSpy = sandbox.spy();
		secondAfterSpy = sandbox.spy();
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should execute step and return final value', async () => {
		const result = await pipeline.add(FirstStep, SecondStep).execute(10);

		expect(result).to.equal(12);
		expect(firstBeforeSpy.getCall(0).args[0]).to.equal(10);
		expect(firstAfterSpy.getCall(0).args[0]).to.equal(12);
		expect(secondBeforeSpy.getCall(0).args[0]).to.equal(11);
		expect(secondAfterSpy.getCall(0).args[0]).to.equal(12);
		sandbox.assert.callOrder(firstBeforeSpy, secondBeforeSpy, secondAfterSpy, firstAfterSpy);
	});
});
