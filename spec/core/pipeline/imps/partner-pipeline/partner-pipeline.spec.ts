import { BaseServiceSetup, PartnerPipeline } from '@wikia/core';
import { wait } from '@wikia/core/utils';
import { expect } from 'chai';
import { SinonSpy } from 'sinon';
import { container as diContainer, injectable } from 'tsyringe';

describe('PartnerPipeline', () => {
	let spy: SinonSpy;
	const container = diContainer.createChildContainer();
	const pipeline = container.resolve(PartnerPipeline);

	beforeEach(() => {
		spy = global.sandbox.spy();
	});

	@injectable()
	class ExampleServiceSetup extends BaseServiceSetup {
		async call() {
			await wait(20);
			spy(1);
		}
	}

	@injectable()
	class ExampleSlowServiceSetup extends BaseServiceSetup {
		async call() {
			await wait(40);
			spy(0);
		}
	}

	it('should work', async () => {
		const exampleSlowServiceSetup = container.resolve(ExampleSlowServiceSetup);
		const exampleServiceSetup = container.resolve(ExampleServiceSetup);

		pipeline
			.add(
				exampleServiceSetup.setOptions({
					dependencies: [exampleSlowServiceSetup.initialized],
					timeout: 100,
				}),
				exampleSlowServiceSetup,
			)
			.execute()
			.then(async () => {
				await wait(20);

				spy(2);
			});

		await progress(40);
		expect(getSpyValues()).to.deep.equal([0]);
		await progress(20);
		expect(getSpyValues()).to.deep.equal([0, 1]);
		await progress(20);
		expect(getSpyValues()).to.deep.equal([0, 1, 2]);
	});

	async function progress(ms: number): Promise<void> {
		await new Promise((resolve) => setTimeout(resolve, ms));
	}

	function getSpyValues(): number[] {
		return spy.getCalls().map((call) => call.args[0]);
	}
});
