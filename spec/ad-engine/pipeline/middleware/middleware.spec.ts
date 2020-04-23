import { MiddlewareService } from '@wikia/ad-engine';
import { assert } from 'chai';
import * as sinon from 'sinon';

describe('middleware-service', () => {
	let middlewareService;

	beforeEach(() => {
		middlewareService = new MiddlewareService();
	});

	it('resolves run all added middlewares', () => {
		const context = {
			number: 1,
		};
		const finalSpy = sinon.spy();

		middlewareService
			.add(({ number }, next) => {
				next({
					number: number + 1,
				});
			})
			.add(({ number }, next) => {
				next({
					number: number * 2,
				});
			})
			.add(({ number }, next) => {
				next({
					number: number + 3,
				});
			})
			.execute(context, finalSpy);

		assert.equal(finalSpy.getCall(0).args[0].number, 7, 'incorrect value at the end of chain');
		assert.equal(finalSpy.calledOnce, true, 'chain did not resolve');
	});

	it('breaks when middleware does not execute next()', () => {
		const context = {
			number: 1,
		};
		const finalSpy = sinon.spy();

		middlewareService
			.add(({ number }, next) => {
				next({
					number: number + 1,
				});
			})
			.add(() => {
				// no-op
			})
			.add(({ number }, next) => {
				next({
					number: number + 3,
				});
			})
			.execute(context, finalSpy);

		assert.equal(finalSpy.notCalled, true, 'chain resolved');
	});
});
