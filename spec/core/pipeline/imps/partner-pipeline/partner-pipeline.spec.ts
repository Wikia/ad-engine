import { BaseServiceSetup, PartnerPipeline } from '@wikia/core';
import { wait } from '@wikia/core/utils';
import { Container } from '@wikia/dependency-injection';
import { expect } from 'chai';
import { createSandbox, SinonSpy } from 'sinon';

describe('PartnerPipeline', () => {
	const sandbox = createSandbox();
	let spy: SinonSpy;
	const container = new Container();
	const pipeline = container.get(PartnerPipeline);

	beforeEach(() => {
		spy = sandbox.spy();
	});

	afterEach(() => {
		sandbox.restore();
	});

	class ExampleServiceSetup extends BaseServiceSetup {
		async call() {
			await wait(20);
			spy(1);
		}
	}

	class ExampleSlowServiceSetup extends BaseServiceSetup {
		async call() {
			await wait(40);
			spy(0);
		}
	}

	it('should work', async () => {
		const exampleSlowServiceSetup = new ExampleSlowServiceSetup();
		const exampleServiceSetup = new ExampleServiceSetup();

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
