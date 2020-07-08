import { parallel, ProcessPipeline } from '@wikia/ad-engine';
import { wait } from '@wikia/ad-engine/utils';
import { Container } from '@wikia/dependency-injection';
import { expect } from 'chai';
import { createSandbox, SinonFakeTimers, SinonSpy } from 'sinon';

describe('ParallelProcess', () => {
	const sandbox = createSandbox();
	let spy: SinonSpy;
	let clock: SinonFakeTimers;
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
		clock = sandbox.useFakeTimers();
		pipeline = container.get(ProcessPipeline);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should work', async () => {
		const promise = pipeline
			.add(
				parallel(
					funcProcess,
					ClassProcess,
					async () => {
						await wait(200);
						spy('async');
					},
					parallel(() => spy('other')),
				),
				() => spy('end'),
			)
			.execute();

		await progress(200);
		assertResults();
		await promise;
		assertResults();
	});

	function assertResults(): void {
		expect(spy.getCalls().map((call) => call.args[0])).to.deep.equal([
			'func',
			'class',
			'other',
			'async',
			'end',
		]);
	}

	async function progress(ms?: number): Promise<void> {
		if (ms) {
			clock.tick(ms);
		}
		await new Promise((resolve) => setImmediate(resolve));
	}
});
