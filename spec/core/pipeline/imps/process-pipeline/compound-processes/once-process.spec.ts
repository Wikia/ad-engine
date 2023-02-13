import { once, ProcessPipeline } from '@wikia/core';
import { expect } from 'chai';
import { createSandbox, SinonStub } from 'sinon';
import { container as tsyringeContainer } from 'tsyringe';

describe('OnceProcess', () => {
	const sandbox = createSandbox();
	let stub: SinonStub;
	let pipeline: ProcessPipeline;

	const funcProcess = () => stub('func');
	const executableOnceProcess = () => stub('once');

	beforeEach(() => {
		const container = tsyringeContainer.createChildContainer();

		stub = sandbox.stub();
		pipeline = container.resolve(ProcessPipeline);
	});

	afterEach(() => {
		tsyringeContainer.clearInstances();
		sandbox.restore();
	});

	it('should work', async () => {
		pipeline.add(
			funcProcess,
			once(executableOnceProcess),
			once(() => stub('arrow')),
			() => stub('end'),
		);

		await pipeline.execute();

		assertResults(['func', 'once', 'arrow', 'end']);

		stub.resetHistory();
		await pipeline.execute();

		assertResults(['func', 'end']);
	});

	it('works on instance-level instead of step-level', async () => {
		pipeline.add(funcProcess, once(executableOnceProcess), once(executableOnceProcess), () =>
			stub('end'),
		);

		await pipeline.execute();

		assertResults(['func', 'once', 'end']);
	});

	function assertResults(expectedCalls): void {
		expect(stub.getCalls().map((call) => call.args[0])).to.deep.equal(expectedCalls);
	}
});
