import { once, ProcessPipeline } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { expect } from 'chai';
import { createSandbox, SinonStub } from 'sinon';

describe('OnceProcess', () => {
	const sandbox = createSandbox();
	let stub: SinonStub;
	let pipeline: ProcessPipeline;

	const funcProcess = () => stub('func');
	const executableOnceProcess = () => stub('once');

	beforeEach(() => {
		const container = new Container();

		stub = sandbox.stub();
		pipeline = container.get(ProcessPipeline);
	});

	afterEach(() => {
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
