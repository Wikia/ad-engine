import { TemplateAction } from '@wikia/core/services/templates-registry/template-action';
import { TemplateMachine } from '@wikia/core/services/templates-registry/template-machine';
import { assert, expect } from 'chai';
import { Subject } from 'rxjs';
import { createTemplateStateStub, TemplateStateStub } from './template-state.stub';

describe('Template Machine', () => {
	let stateA: TemplateStateStub;
	let stateB: TemplateStateStub;
	let machine: TemplateMachine;

	beforeEach(() => {
		stateA = createTemplateStateStub(global.sandbox);
		stateB = createTemplateStateStub(global.sandbox);
		machine = new TemplateMachine(
			'mock-template',
			new Map([
				['a', stateA],
				['b', stateB],
			]) as any,
			'a',
			new Subject<TemplateAction>(),
		);
	});

	it('should enter initial state after init', () => {
		assert(!stateA.enter.called);
		assert(!stateA.leave.called);
		assert(!stateB.enter.called);
		assert(!stateB.leave.called);

		machine.init();

		assert(stateA.enter.calledOnce);
		assert(!stateA.leave.called);
		assert(!stateB.enter.called);
		assert(!stateB.leave.called);
	});

	it('should leave current state and then destroy all', async () => {
		await machine.init();
		await machine.destroy();

		assert(stateA.leave.called);
		assert(!stateB.leave.called);
		assert(stateA.destroy.called);
		assert(stateB.destroy.called);
		global.sandbox.assert.callOrder(stateA.leave, stateA.destroy, stateB.destroy);
	});

	it('should respond to transition', async () => {
		stateA.enter.callsFake((transition) => {
			transition('b');
		});
		machine.init();

		assert(stateA.enter.calledOnce);
		assert(stateA.leave.calledOnce);

		await Promise.resolve();

		assert(stateB.enter.calledOnce);
		assert(!stateB.leave.called);

		global.sandbox.assert.callOrder(stateA.enter, stateA.leave, stateB.enter);
	});

	it('should throw when transition to the same state', (done) => {
		stateA.enter.callsFake(async (transition) => {
			try {
				await transition('a');
				assert(false);
			} catch (e) {
				expect(e.message).to.equal('Template mock-template - already is in a state');
			}
			done();
		});
		machine.init();
	});

	it('should throw when transition to not existing state', (done) => {
		stateA.enter.callsFake(async (transition) => {
			try {
				await transition('wrong');
				assert(false);
			} catch (e) {
				expect(e.message).to.equal('Template mock-template - state (wrong) does not exist.');
			}
			done();
		});
		machine.init();
	});
});
