import { TemplateMachine } from '@wikia/ad-engine/services/templates-registry/template-machine';
import { assert, expect } from 'chai';
import { createSandbox } from 'sinon';
import { createTemplateStaterStub, TemplateStateStub } from './template-state.stub';

describe('Template Machine', () => {
	const sandbox = createSandbox();
	let stateA: TemplateStateStub;
	let stateB: TemplateStateStub;
	let machine: TemplateMachine;

	beforeEach(() => {
		stateA = createTemplateStaterStub(sandbox);
		stateB = createTemplateStaterStub(sandbox);
		machine = new TemplateMachine(
			'mock-template',
			new Map([['a', stateA], ['b', stateB]]) as any,
			'a',
		);
	});

	afterEach(() => {
		sandbox.reset();
	});

	it('should enter initial state state after init', () => {
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

	it('should respond to immediate transition', async () => {
		stateA.enter.callsFake(() => stateA.transitionSubject$.next('b'));
		machine.init();

		assert(stateA.enter.calledOnce);
		assert(stateA.leave.calledOnce);

		await Promise.resolve();

		assert(stateB.enter.calledOnce);
		assert(!stateB.leave.called);

		sandbox.assert.callOrder(stateA.enter, stateA.leave, stateB.enter);
	});

	it('should respond to any terminate', async () => {
		machine.init();
		stateA.transitionSubject$.next('b');

		assert(stateA.enter.calledOnce);
		assert(stateA.leave.calledOnce);

		await Promise.resolve();

		assert(stateB.enter.calledOnce);
		assert(!stateB.leave.called);
	});

	it('should stop working after terminate', async () => {
		machine.init();
		machine.terminate();
		stateA.transitionSubject$.next('b');

		assert(stateA.enter.calledOnce);
		assert(!stateA.leave.called);

		await Promise.resolve();

		assert(!stateB.enter.called);
		assert(!stateB.leave.called);
	});

	it('should throw if initialized twice', () => {
		machine.init();
		expect(() => machine.init()).to.throw('Template mock-template can be initialized only once');
	});

	it('should throw if terminate before initialize', () => {
		expect(() => machine.terminate()).to.throw();
	});
});
