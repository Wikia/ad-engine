import { expect } from 'chai';
import * as sinon from 'sinon';
import { context } from '../../../src/ad-engine/index';
import { Executor } from '../../../src/ad-services/bill-the-lizard/executor';

describe('Bill the Lizard projects handler', () => {
	let executor;
	let sandbox;

	beforeEach(() => {
		executor = new Executor();
		executor.register('incorrectType', 'string');
		executor.register('correct', () => 'executed');

		context.set('services.billTheLizard.projects', {
			foo: [
				{
					name: 'bar:1.0.0',
					countries: ['ZZ'],
				},
				{
					name: 'bar:0.0.1',
					countries: ['XX'],
				},
			],
			second: [
				{
					name: 'buzz:1.0.0',
					countries: ['XX'],
				},
				{
					name: 'buzz:0.0.1',
					countries: ['XX'],
				},
			],
		});

		sandbox = sinon.sandbox.create();
		sinon.spy(executor.methods, 'correct');
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('non existing method throws an error', () => {
		expect(() => {
			executor.execute('nonExisting', 'foo', 0);
		}).to.throw('nonExisting is not executable');
	});

	it('incorrect type of method throws an error', () => {
		expect(() => {
			executor.execute('incorrectType', 'foo', 0);
		}).to.throw('incorrectType is not executable');
	});

	it('correct method can be executed', () => {
		executor.execute('correct', 'foo', 0);

		expect(executor.methods.correct.calledOnce).to.equal(true);
	});

	it('execute methods on executable models', () => {
		executor.register('onFooFailure', () => {});
		executor.register('onFooSuccess', () => {});
		executor.register('onBarFailure', () => {});
		executor.register('onBarSuccess', () => {});

		sinon.spy(executor.methods, 'onFooFailure');
		sinon.spy(executor.methods, 'onFooSuccess');
		sinon.spy(executor.methods, 'onBarFailure');
		sinon.spy(executor.methods, 'onBarSuccess');

		executor.executeMethods(
			[
				{
					name: 'foo',
					executable: true,
					on_0: ['onFooFailure'],
					on_1: ['onFooSuccess'],
				},
				{
					name: 'bar',
					executable: false,
					on_0: ['onBarFailure'],
					on_1: ['onBarSuccess'],
				},
			],
			{
				foo: {
					result: 0,
				},
				bar: {
					result: 1,
				},
			},
		);

		expect(executor.methods.onFooFailure.calledOnce).to.equal(true);
		expect(executor.methods.onFooSuccess.calledOnce).to.equal(false);
		expect(executor.methods.onBarFailure.calledOnce).to.equal(false);
		expect(executor.methods.onBarSuccess.calledOnce).to.equal(false);
	});
});
