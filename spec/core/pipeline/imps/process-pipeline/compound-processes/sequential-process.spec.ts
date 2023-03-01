import { ProcessPipeline, sequential } from '@wikia/core';
import { wait } from '@wikia/core/utils';
import { Container } from '@wikia/dependency-injection';
import { expect } from 'chai';
import { SinonSpy } from 'sinon';

describe('SequentialProcess', () => {
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

		spy = global.sandbox.spy();
		pipeline = container.get(ProcessPipeline);
	});

	it('should work', async () => {
		const promise = pipeline
			.add(
				sequential(
					funcProcess,
					ClassProcess,
					async () => {
						await wait(20);
						spy('async');
					},
					sequential(() => spy('other')),
				),
				() => spy('end'),
			)
			.execute();

		await progress(0);
		expect(spy.getCalls().map((call) => call.args[0])).to.deep.equal(['func', 'class']);
		await progress(20);
		assertResults();
		await promise;
		assertResults();
	});

	function assertResults(): void {
		expect(spy.getCalls().map((call) => call.args[0])).to.deep.equal([
			'func',
			'class',
			'async',
			'other',
			'end',
		]);
	}

	async function progress(ms: number): Promise<void> {
		await new Promise((resolve) => setTimeout(resolve, ms));
	}
});
