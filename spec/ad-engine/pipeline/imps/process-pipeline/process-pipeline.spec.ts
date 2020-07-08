import { conditional, DiProcess, parallel, ProcessPipeline, sequential } from '@wikia/ad-engine';
import { wait } from '@wikia/ad-engine/utils';
import { Container } from '@wikia/dependency-injection';
import { expect } from 'chai';
import { createSandbox, SinonSpy } from 'sinon';

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
		const container = new Container();
		const pipeline = container.get(ProcessPipeline);

		await pipeline
			.add(
				sequential(
					ClassProcess,
					() => spy(1),
					async () => {
						await wait(1);
						spy(2);
					},
					parallel(
						async () => {
							await wait(2);
							spy(4);
						},
						async () => {
							await wait(1);
							spy(3);
						},
					),
				),
				() => spy(5),
				conditional(() => true, { yes: () => spy(6) }),
			)
			.execute();

		expect(getSpyValues()).to.deep.equal([0, 1, 2, 3, 4, 5, 6]);
	});

	function getSpyValues(): number[] {
		return spy.getCalls().map((call) => call.args[0]);
	}
});
