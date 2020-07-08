import { conditional, ProcessPipeline } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { expect } from 'chai';
import { createSandbox, SinonSpy } from 'sinon';

describe('ConditionalProcess', () => {
	const sandbox = createSandbox();
	let spy: SinonSpy;
	let pipeline: ProcessPipeline;

	const yesProcess = () => spy(true);

	class NoProcess {
		async execute(): Promise<void> {
			spy(false);
		}
	}

	beforeEach(() => {
		const container = new Container();

		spy = sandbox.spy();
		pipeline = container.get(ProcessPipeline);
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('Condition', () => {
		let flag: boolean;

		afterEach(async () => {
			flag = true;
			await pipeline.execute();
			expect(spy.getCalls()[0].args[0]).to.equal(true);

			flag = false;
			await pipeline.execute();
			expect(spy.getCalls()[1].args[0]).to.equal(false);
		});

		it('should work with class condition', async () => {
			class ClassCondition {
				execute(): boolean {
					return flag;
				}
			}

			pipeline.add(conditional(ClassCondition, { yes: yesProcess, no: NoProcess }));
		});

		it('should work with func condition', async () => {
			const funcCondition = async () => {
				return flag;
			};

			pipeline.add(conditional(funcCondition, { yes: yesProcess, no: NoProcess }));
		});
	});

	it('should work with CompoundProcess', async () => {
		await pipeline
			.add(
				conditional(() => true, { yes: conditional(() => false, { no: NoProcess }) }),
				() => spy('end'),
			)
			.execute();

		expect(spy.getCalls().map((call) => call.args[0])).to.deep.equal([false, 'end']);
	});
});
