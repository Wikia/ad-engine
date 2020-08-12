import { once, ProcessPipeline } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { expect } from 'chai';
import { createSandbox, SinonSpy } from 'sinon';

describe('OnceProcess', () => {
	const sandbox = createSandbox();
	let spy: SinonSpy;
	let pipeline: ProcessPipeline;

	const funcProcess = () => spy('func');
	const executableOnceProcess = () => spy('once');

	beforeEach(() => {
		const container = new Container();

		spy = sandbox.spy();
		pipeline = container.get(ProcessPipeline);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should work', async () => {
		pipeline.add(funcProcess, once(executableOnceProcess), () => spy('end'));

		await pipeline.execute();

		assertResults(['func', 'once', 'end']);

		spy = sandbox.spy();
		await pipeline.execute();

		assertResults(['func', 'end']);
	});

	it('works on instance-level instead of step-level', async () => {
		pipeline.add(funcProcess, once(executableOnceProcess), once(executableOnceProcess), () =>
			spy('end'),
		);

		await pipeline.execute();

		assertResults(['func', 'once', 'end']);
	});

	function assertResults(expectedCalls): void {
		expect(spy.getCalls().map((call) => call.args[0])).to.deep.equal(expectedCalls);
	}
});
