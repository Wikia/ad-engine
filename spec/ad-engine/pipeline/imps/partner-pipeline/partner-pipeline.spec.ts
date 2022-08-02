import { Container } from '@wikia/dependency-injection';
import { BaseServiceSetup, PartnerPipeline } from '@wikia/ad-engine';
import { createSandbox, SinonFakeTimers, SinonSpy } from 'sinon';
import { expect } from 'chai';
import { wait } from '@wikia/ad-engine/utils';

describe('PartnerPipeline', () => {
	const sandbox = createSandbox();
	let spy: SinonSpy;
	let clock: SinonFakeTimers;
	const container = new Container();
	const pipeline = container.get(PartnerPipeline);

	beforeEach(() => {
		spy = sandbox.spy();
		clock = sandbox.useFakeTimers();
	});

	afterEach(() => {
		sandbox.restore();
	});

	class ExampleServiceSetup extends BaseServiceSetup {
		async initialize() {
			await wait(200);

			spy(1);
			this.setInitialized();
		}
	}

	class ExampleSlowServiceSetup extends BaseServiceSetup {
		async initialize() {
			await wait(400);

			spy(0);
			this.setInitialized();
		}
	}

	it('should work', async () => {
		const exampleSlowServiceSetup = new ExampleSlowServiceSetup();
		const exampleServiceSetup = new ExampleServiceSetup();

		pipeline
			.add(
				exampleServiceSetup.setOptions({
					dependencies: [exampleSlowServiceSetup.initialized],
					timeout: 1000,
				}),
				exampleSlowServiceSetup,
			)
			.execute()
			.then(async () => {
				await wait(200);

				spy(2);
			});

		await progress(400);
		expect(getSpyValues()).to.deep.equal([0]);
		await progress(200);
		expect(getSpyValues()).to.deep.equal([0, 1]);
		await progress(200);
		expect(getSpyValues()).to.deep.equal([0, 1, 2]);
	});

	async function progress(ms?: number): Promise<void> {
		if (ms) {
			clock.tick(ms);
		}
		await new Promise((resolve) => setImmediate(resolve));
	}

	function getSpyValues(): number[] {
		return spy.getCalls().map((call) => call.args[0]);
	}
});
