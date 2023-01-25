import { once, ProcessPipeline } from '@wikia/core';
import { Container } from '@wikia/dependency-injection';
import { expect } from 'chai';
import { SinonStub } from 'sinon';

describe('OnceProcess', () => {
	let stub: SinonStub;
	let pipeline: ProcessPipeline;

	const funcProcess = () => stub('func');
	const executableOnceProcess = () => stub('once');

	beforeEach(() => {
		const container = new Container();

		stub = global.sandbox.stub();
		pipeline = container.get(ProcessPipeline);
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
