import {
	conditional,
	DiProcess,
	parallel,
	PipelineProcess,
	ProcessPipeline,
	sequential,
} from '@wikia/ad-engine';
import { wait } from '@wikia/ad-engine/utils';
import { Container } from '@wikia/dependency-injection';
import { expect } from 'chai';
import { createSandbox, SinonFakeTimers, SinonSpy } from 'sinon';

describe('ProcessPipeline', () => {
	const sandbox = createSandbox();
	let spy: SinonSpy;
	let clock: SinonFakeTimers;

	class DiBuildProcess implements DiProcess {
		execute(): void {
			spy(0);
		}
	}

	class InstanceProcess implements PipelineProcess {
		execute(): Promise<void> {
			spy(7);
			return Promise.resolve();
		}
	}

	beforeEach(() => {
		spy = sandbox.spy();
		clock = sandbox.useFakeTimers();
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should work', async () => {
		const container = new Container();
		const pipeline = container.get(ProcessPipeline);

		const promise = pipeline
			.add(
				sequential(
					DiBuildProcess,
					() => spy(1),
					async () => {
						await wait(100);
						spy(2);
					},
					parallel(
						async () => {
							await wait(200);
							spy(4);
						},
						async () => {
							await wait(100);
							spy(3);
						},
					),
				),
				() => spy(5),
				conditional(() => true, { yes: () => spy(6) }),
				new InstanceProcess(),
			)
			.execute();

		expect(getSpyValues()).to.deep.equal([0]);
		await progress();
		expect(getSpyValues()).to.deep.equal([0, 1]);
		await progress(100);
		expect(getSpyValues()).to.deep.equal([0, 1, 2]);
		await progress(100);
		expect(getSpyValues()).to.deep.equal([0, 1, 2, 3]);
		await progress(100);
		expect(getSpyValues()).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7]);
		await promise;
		expect(getSpyValues()).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7]);
	});

	function getSpyValues(): number[] {
		return spy.getCalls().map((call) => call.args[0]);
	}

	async function progress(ms?: number): Promise<void> {
		if (ms) {
			clock.tick(ms);
		}
		await new Promise((resolve) => setImmediate(resolve));
	}
});
