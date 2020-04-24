import { Pipeline } from '@wikia/ad-engine';
import { expect } from 'chai';
import { SinonSandbox, SinonSpy } from 'sinon';

interface Steps<TStep> {
	first: TStep;
	second: TStep;
	final: TStep;
}

interface Spys {
	firstBefore: SinonSpy;
	firstAfter: SinonSpy;
	secondBefore: SinonSpy;
	secondAfter: SinonSpy;
	final: SinonSpy;
}

export class PipelineTestSuite<TStep> {
	static generateSpys(sandbox: SinonSandbox): Spys {
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
		private spys: Spys,
		private pipeline: Pipeline<TStep, number>,
		private steps: Steps<TStep>,
	) {}

	async executeWithoutFinal() {
		const result = await this.pipeline.add(this.steps.first, this.steps.second).execute(10);

		expect(this.spys.firstBefore.getCall(0).args[0]).to.equal(10, 'firstBefore');
		expect(this.spys.secondBefore.getCall(0).args[0]).to.equal(11, 'secondBefore');
		expect(this.spys.secondAfter.getCall(0).args[0]).to.equal(12, 'secondAfter');
		expect(this.spys.firstAfter.getCall(0).args[0]).to.equal(12, 'firstAfter');
		this.sandbox.assert.callOrder(
			this.spys.firstBefore,
			this.spys.secondBefore,
			this.spys.secondAfter,
			this.spys.firstAfter,
		);
		expect(result).to.equal(12, 'result');
	}
}
