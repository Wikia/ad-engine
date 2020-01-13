import { TemplateMachine } from '@wikia/ad-engine/services/templates-registry/template-machine';
import { assert } from 'chai';
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

	// it('should respond to first navigation', (done) => {
	// 	stateA.enter.callsFake(async () => {
	// 		stateA.transitionSubject$.next('b');
	// 	});
	//
	// 	machine.init().subscribe(() => {
	// 		assert(stateA.enter.calledOnce);
	// 		assert(stateA.leave.calledOnce);
	// 		assert(stateB.enter.calledOnce);
	// 		assert(!stateB.leave.called);
	// 		done();
	// 	});
	// });

	it('should throw if attempting to transition to the same state', () => {
		try {
			machine.init();
			stateA.transitionSubject$.next('a');
			stateA.transitionSubject$.next('a');
		} catch (e) {
			console.log('bielik');
			console.log(e);
		}
	});
});
