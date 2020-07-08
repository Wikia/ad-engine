import { ProcessPipeline, sequential } from '@wikia/ad-engine';
import { wait } from '@wikia/ad-engine/utils';
import { Container } from '@wikia/dependency-injection';
import { expect } from 'chai';
import { createSandbox, SinonSpy } from 'sinon';

describe('SequentialProcess', () => {
	const sandbox = createSandbox();
	let spy: SinonSpy;
	let pipeline: ProcessPipeline;

	const funcProcess = () => spy('func');

	class ClassProcess {
		async execute(): Promise<void> {
			spy('class');
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

	it('should work', async () => {
		await pipeline
			.add(
				sequential(
					funcProcess,
					ClassProcess,
					async () => {
						await wait(2);
						spy('async');
					},
					sequential(() => spy('other')),
				),
				() => spy('end'),
			)
			.execute();

		expect(spy.getCalls().map((call) => call.args[0])).to.deep.equal([
			'func',
			'class',
			'async',
			'other',
			'end',
		]);
	});
});
