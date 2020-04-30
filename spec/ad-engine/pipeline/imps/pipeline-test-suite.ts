import { Pipeline } from '@wikia/ad-engine';
import { expect } from 'chai';
import { SinonSandbox, SinonSpy } from 'sinon';

interface Steps<TStep> {
	first: TStep;
	second: TStep;
	final: TStep;
}

interface Spies {
	firstBefore: SinonSpy;
	firstAfter: SinonSpy;
	secondBefore: SinonSpy;
	secondAfter: SinonSpy;
	final: SinonSpy;
}

export class PipelineTestSuite<TStep> {
	static generateSpies(sandbox: SinonSandbox): Spies {
		return {
			firstBefore: sandbox.spy(),
			firstAfter: sandbox.spy(),
			secondBefore: sandbox.spy(),
			secondAfter: sandbox.spy(),
			final: sandbox.spy(),
		};
	}

	constructor(
		private sandbox: SinonSandbox,
		private spies: Spies,
		private pipeline: Pipeline<TStep, number>,
		private steps: Steps<TStep>,
	) {}

	async executeWithoutFinal(): Promise<void> {
		const result = await this.pipeline.add(this.steps.first, this.steps.second).execute(10);

		expect(this.spies.firstBefore.getCall(0).args[0]).to.equal(10, 'firstBefore');
		expect(this.spies.secondBefore.getCall(0).args[0]).to.equal(11, 'secondBefore');
		expect(this.spies.secondAfter.getCall(0).args[0]).to.equal(12, 'secondAfter');
		expect(this.spies.firstAfter.getCall(0).args[0]).to.equal(12, 'firstAfter');
		this.sandbox.assert.callOrder(
			this.spies.firstBefore,
			this.spies.secondBefore,
			this.spies.secondAfter,
			this.spies.firstAfter,
		);
		expect(result).to.equal(12, 'result');
	}

	async executeWithFinal(): Promise<void> {
		this.pipeline.add(this.steps.first, this.steps.second);

		const result = await this.pipeline.execute(10, this.steps.final);

		expect(this.spies.firstBefore.getCall(0).args[0]).to.equal(10, 'firstBefore');
		expect(this.spies.secondBefore.getCall(0).args[0]).to.equal(11, 'secondBefore');
		expect(this.spies.final.getCall(0).args[0]).to.equal(12, 'final');
		expect(this.spies.secondAfter.getCall(0).args[0]).to.equal(13, 'secondAfter');
		expect(this.spies.firstAfter.getCall(0).args[0]).to.equal(13, 'firstAfter');
		this.sandbox.assert.callOrder(
			this.spies.firstBefore,
			this.spies.secondBefore,
			this.spies.final,
			this.spies.secondAfter,
			this.spies.firstAfter,
		);
		expect(result).to.equal(13, 'result');

		const result2 = await this.pipeline.execute(10, this.steps.final);

		expect(result2).to.equal(13, 'result2');
		expect(this.spies.final.callCount).to.equal(2, 'final should be called only twice');
	}

	async executeWithCutoff(): Promise<void> {
		const result = await this.pipeline
			.add(this.steps.first, this.steps.final, this.steps.second)
			.execute(10);

		expect(this.spies.firstBefore.getCall(0).args[0]).to.equal(10, 'firstBefore');
		expect(this.spies.final.getCall(0).args[0]).to.equal(11, 'final');
		expect(this.spies.firstAfter.getCall(0).args[0]).to.equal(12, 'firstAfter');
		expect(this.spies.secondBefore.callCount).to.equal(0, 'before should not be called');
		this.sandbox.assert.callOrder(this.spies.firstBefore, this.spies.final, this.spies.firstAfter);
		expect(result).to.equal(12, 'result');
	}
}
