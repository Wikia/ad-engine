import { conditional, DiProcess, parallel, ProcessPipeline, sequential } from '@wikia/core';
import { wait } from '@wikia/core/utils';
import { expect } from 'chai';
import { createSandbox, SinonSpy } from 'sinon';
import { container as tsyringeContainer } from 'tsyringe';

describe('ProcessPipeline', () => {
	const sandbox = createSandbox();
	let spy: SinonSpy;

	class ClassProcess implements DiProcess {
		execute(): void {
			spy(0);
		}
	}

	beforeEach(() => {
		spy = sandbox.spy();
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should work', async () => {
		const container = tsyringeContainer.createChildContainer();
		const pipeline = container.resolve(ProcessPipeline);

		const promise = pipeline
			.add(
				sequential(
					ClassProcess,
					() => spy(1),
					async () => {
						await wait(10);
						spy(2);
					},
					parallel(
						async () => {
							await wait(20);
							spy(4);
						},
						async () => {
							await wait(10);
							spy(3);
						},
					),
				),
				() => spy(5),
				conditional(() => true, { yes: () => spy(6) }),
			)
			.execute();

		expect(getSpyValues()).to.deep.equal([0]);
		await progress(0);
		expect(getSpyValues()).to.deep.equal([0, 1]);
		await progress(10);
		expect(getSpyValues()).to.deep.equal([0, 1, 2]);
		await progress(10);
		expect(getSpyValues()).to.deep.equal([0, 1, 2, 3]);
		await progress(10);
		expect(getSpyValues()).to.deep.equal([0, 1, 2, 3, 4, 5, 6]);
		await promise;
		expect(getSpyValues()).to.deep.equal([0, 1, 2, 3, 4, 5, 6]);
	});

	function getSpyValues(): number[] {
		return spy.getCalls().map((call) => call.args[0]);
	}

	async function progress(ms: number): Promise<void> {
		await new Promise((resolve) => setTimeout(resolve, ms));
	}
});
