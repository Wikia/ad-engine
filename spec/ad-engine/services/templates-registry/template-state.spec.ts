import { TemplateTransition } from '@wikia/ad-engine';
import { TemplateState } from '@wikia/ad-engine/services/templates-registry/template-state';
import { assert, expect } from 'chai';
import { take } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import { createSandbox } from 'sinon';
import { createTemplateStateHandlerStub } from './template-state-handler.stub';

describe('Template State', () => {
	const sandbox = createSandbox();
	// @ts-ignore
	let scheduler: TestScheduler;

	beforeEach(() => {
		scheduler = new TestScheduler((actual, expected) => {
			expect(actual).to.equal(expected);
		});
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should transition to and from a state', () => {
		const handlerStub1 = createTemplateStateHandlerStub(sandbox);
		const handlerStub2 = createTemplateStateHandlerStub(sandbox);
		const instance = new TemplateState('mock', [handlerStub1, handlerStub2]);

		instance.enter();
		assert(handlerStub1.onEnter.calledOnce);
		assert(handlerStub2.onEnter.calledOnce);
		assert(handlerStub1.onLeave.callCount === 0);
		assert(handlerStub2.onLeave.callCount === 0);

		instance.leave();
		assert(handlerStub1.onEnter.calledOnce);
		assert(handlerStub2.onEnter.calledOnce);
		assert(handlerStub1.onLeave.calledOnce);
		assert(handlerStub2.onLeave.calledOnce);
	});

	it('should transition out of a state', (done) => {
		const handlerStub = createTemplateStateHandlerStub(sandbox);
		const instance = new TemplateState('mock', [handlerStub]);
		let transition: TemplateTransition;

		handlerStub.onEnter.callsFake((arg) => (transition = arg));
		instance.enter();

		instance.transition$.pipe(take(1)).subscribe((value) => {
			expect(value).to.equal('other');
			done();
		});
		transition('other');
	});

	it('should throw if attempting second transition', async () => {
		const handlerStub = createTemplateStateHandlerStub(sandbox);
		const instance = new TemplateState('mock', [handlerStub]);
		let transition: TemplateTransition;

		handlerStub.onEnter.callsFake((arg) => (transition = arg));
		instance.enter();

		await transition('other');
		try {
			await transition('other');
			assert(false);
		} catch (e) {
			assert(true);
		}
	});

	it('should preserve order');
});
