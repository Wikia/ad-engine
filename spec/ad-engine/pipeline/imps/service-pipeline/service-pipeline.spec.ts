import { Container } from '@wikia/dependency-injection';
import { Service, ServicePipeline, ServiceStage } from '@wikia/ad-engine';
import { createSandbox, SinonFakeTimers, SinonSpy } from 'sinon';
import { expect } from 'chai';
import { wait } from '@wikia/ad-engine/utils';

describe('ServicePipeline', () => {
	const sandbox = createSandbox();
	let spy: SinonSpy;
	let clock: SinonFakeTimers;
	const container = new Container();
	const pipeline = container.get(ServicePipeline);

	beforeEach(() => {
		spy = sandbox.spy();
		clock = sandbox.useFakeTimers();
	});

	afterEach(() => {
		sandbox.restore();
	});

	@Service({
		stage: ServiceStage.baseSetup,
	})
	class ExampleSlowServiceSetup {
		async call() {
			await wait(400);
			spy(0);
		}
	}
	const exampleSlowServiceSetup = new ExampleSlowServiceSetup();

	@Service({
		stage: ServiceStage.baseSetup,
		dependencies: [exampleSlowServiceSetup],
		timeout: 1000,
	})
	class ExampleServiceSetup {
		async call() {
			await wait(200);
			spy(1);
		}
	}
	const exampleServiceSetup = new ExampleServiceSetup();

	it('should work', async () => {
		pipeline
			.add(exampleSlowServiceSetup, exampleServiceSetup)
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
