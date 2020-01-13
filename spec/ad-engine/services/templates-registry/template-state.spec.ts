import { TemplateTransition } from '@wikia/ad-engine';
import { TemplateState } from '@wikia/ad-engine/services/templates-registry/template-state';
import { assert, expect } from 'chai';
import { createSandbox, SinonStub } from 'sinon';
import { createTemplateStateHandlerStub } from './template-state-handler.stub';

describe('Template State', () => {
	const sandbox = createSandbox();
	let templateTransitionStub: SinonStub;

	beforeEach(() => {
		templateTransitionStub = sandbox.stub().resolves();
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should transition to and from a state', () => {
		const handlerStub1 = createTemplateStateHandlerStub(sandbox);
		const handlerStub2 = createTemplateStateHandlerStub(sandbox);
		const instance = new TemplateState('mock', [handlerStub1, handlerStub2]);

		instance.enter(templateTransitionStub);
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

	it('should transition out of a state', async () => {
		const handlerStub = createTemplateStateHandlerStub(sandbox);
		const instance = new TemplateState('mock', [handlerStub]);

		handlerStub.onEnter.callsFake((stateTransition) => {
			stateTransition('other');
		});
		await instance.enter(templateTransitionStub);

		assert(templateTransitionStub.calledOnce);
		expect(templateTransitionStub.getCall(0).args[0]).to.equal('other');
	});

	it('should throw when attempting second transition if allowMulticast set to false', async () => {
		const handlerStub = createTemplateStateHandlerStub(sandbox);
		const instance = new TemplateState('mock', [handlerStub]);
		let stateTransition: TemplateTransition;

		handlerStub.onEnter.callsFake((arg) => {
			stateTransition = arg;
		});
		instance.enter(templateTransitionStub);

		await stateTransition('other');
		try {
			await stateTransition('other');
			assert(false);
		} catch (e) {
			assert(true);
		}
		try {
			await stateTransition('other', { allowMulticast: false });
			assert(false);
		} catch (e) {
			assert(true);
		}
		try {
			await stateTransition('other', { allowMulticast: true });
			assert(true);
		} catch (e) {
			assert(false);
		}
	});

	it('should postpone transition till all handlers enter', (done) => {
		const handlerStub1 = createTemplateStateHandlerStub(sandbox);
		const handlerStub2 = createTemplateStateHandlerStub(sandbox);
		const instance = new TemplateState('mock', [handlerStub1, handlerStub2]);

		templateTransitionStub.callsFake(() => {
			sandbox.assert.callOrder(handlerStub1.onEnter, handlerStub2.onEnter);
			assert(handlerStub1.onEnter.calledOnce);
			assert(handlerStub2.onEnter.calledOnce);
			assert(handlerStub1.onLeave.callCount === 0);
			assert(handlerStub2.onLeave.callCount === 0);
			done();
		});
		handlerStub1.onEnter.callsFake((stateTransition) => {
			stateTransition('other');
		});
		instance.enter(templateTransitionStub);
	});
});
