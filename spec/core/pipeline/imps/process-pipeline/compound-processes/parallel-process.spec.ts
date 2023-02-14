import { parallel, ProcessPipeline } from '@wikia/core';
import { wait } from '@wikia/core/utils';
import { expect } from 'chai';
import { createSandbox, SinonSpy } from 'sinon';
import { container as diContainer } from 'tsyringe';

describe('ParallelProcess', () => {
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
		const container = diContainer.createChildContainer();

		spy = sandbox.spy();
		pipeline = container.resolve(ProcessPipeline);
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
						await wait(20);
						spy('async');
					},
					parallel(() => spy('other')),
				),
				() => spy('end'),
			)
			.execute();

		await progress(20);
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

	async function progress(ms: number): Promise<void> {
		await new Promise((resolve) => setTimeout(resolve, ms));
	}
});
