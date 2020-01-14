import {
	AdSlot,
	Dictionary,
	TEMPLATE,
	TemplateRegistry,
	TemplateStateHandler,
	TemplateTransition,
} from '@wikia/ad-engine';
import { Container, Inject, Injectable } from '@wikia/dependency-injection';
import { assert, expect } from 'chai';
import { createSandbox } from 'sinon';
import {
	createTemplateStateHandlerSpy,
	TemplateStateHandlerSpy,
} from './template-state-handler.spy';

describe('Template Registry', () => {
	const sandbox = createSandbox();
	let stateASpy: TemplateStateHandlerSpy;
	let stateBSpy: TemplateStateHandlerSpy;
	let stateSharedSpy: TemplateStateHandlerSpy;
	let container: Container;
	let instance: TemplateRegistry;

	@Injectable()
	class StateAHandler implements TemplateStateHandler {
		constructor(
			@Inject(TEMPLATE.NAME) name: string,
			@Inject(TEMPLATE.SLOT) slot: AdSlot,
			@Inject(TEMPLATE.PARAMS) params: Dictionary,
		) {
			stateASpy.constructor(name, slot, params);
		}

		async onEnter(transition: TemplateTransition<'b'>): Promise<void> {
			stateASpy.onEnter(transition);
		}

		async onLeave(): Promise<void> {
			stateASpy.onLeave();
		}
	}

	class StateBHandler implements TemplateStateHandler {
		constructor() {
			stateBSpy.constructor();
		}

		async onEnter(transition: TemplateTransition<'b'>): Promise<void> {
			stateBSpy.onEnter(transition);
		}

		async onLeave(): Promise<void> {
			stateBSpy.onLeave();
		}
	}

	class StateSharedHandler implements TemplateStateHandler {
		constructor() {
			stateSharedSpy.constructor();
		}

		async onEnter(transition: TemplateTransition<'b'>): Promise<void> {
			stateSharedSpy.onEnter(transition);
		}

		async onLeave(): Promise<void> {
			stateSharedSpy.onLeave();
		}
	}

	beforeEach(() => {
		stateASpy = createTemplateStateHandlerSpy(sandbox);
		stateBSpy = createTemplateStateHandlerSpy(sandbox);
		stateSharedSpy = createTemplateStateHandlerSpy(sandbox);
		container = new Container();
		instance = container.get(TemplateRegistry);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should throw error if template not registered', () => {
		expect(() => instance.init('mock', {} as any)).to.throw('Template mock was not registered');
	});

	it('should throw when initialized twice', () => {
		instance.register('mock', { a: [StateAHandler], b: [StateBHandler] }, 'a');
		instance.init('mock', {} as any);
		expect(() => instance.init('mock', {} as any)).to.throw('Template mock is already initialized');
	});

	describe('Initialized', () => {
		const templateName1 = 'foo';
		const templateName2 = 'bar';
		const templateSlot: AdSlot = { slot: 'slot-value' } as any;
		const templateParams = { params: 'params-value' };
		const template = {
			a: [StateAHandler, StateSharedHandler],
			b: [StateBHandler, StateSharedHandler],
		};

		beforeEach(() => {
			instance.register(templateName1, template, 'a');
			instance.register(templateName2, template, 'a');
		});

		it('should not start before init', () => {
			assert(stateASpy.constructor.notCalled);
			assert(stateBSpy.constructor.notCalled);
			assert(stateSharedSpy.constructor.notCalled);
		});

		it('should create all handlers on init', () => {
			instance.init(templateName1, templateSlot, templateParams);

			assert(stateASpy.constructor.calledOnce);
			assert(stateBSpy.constructor.calledOnce);
			assert(stateSharedSpy.constructor.calledTwice);
		});

		it('should create all handlers on init for two templates', () => {
			instance.init(templateName1, templateSlot, templateParams);
			instance.init(templateName2, templateSlot, templateParams);

			assert(stateASpy.constructor.calledTwice);
			assert(stateBSpy.constructor.calledTwice);
			assert(stateSharedSpy.constructor.callCount === 4);
		});

		it('should be able inject correct params', () => {
			instance.init(templateName1, templateSlot, templateParams);

			const [name, slot, params] = stateASpy.constructor.getCall(0).args;

			expect(name).to.equal(templateName1);
			expect(slot).to.equal(templateSlot);
			expect(params).to.equal(templateParams);
		});

		it('should enter initial state', () => {
			instance.init(templateName1, templateSlot, templateParams);

			assert(stateASpy.onEnter.calledOnce);
			assert(stateASpy.onLeave.notCalled);
			assert(stateBSpy.onEnter.notCalled);
			assert(stateBSpy.onLeave.notCalled);
			assert(stateSharedSpy.onEnter.calledOnce);
			assert(stateSharedSpy.onLeave.notCalled);
		});

		it('should transition in order - enter, leave, enter', (done) => {
			stateASpy.onEnter.callsFake((transition) => {
				transition('b');
			});

			stateSharedSpy.onEnter.onCall(1).callsFake(() => {
				assert(stateASpy.onEnter.calledOnce);
				assert(stateASpy.onLeave.calledOnce);
				assert(stateBSpy.onEnter.calledOnce);
				assert(stateBSpy.onLeave.notCalled);
				assert(stateSharedSpy.onEnter.calledTwice);
				assert(stateSharedSpy.onLeave.calledOnce);
				sandbox.assert.callOrder(
					stateASpy.onEnter,
					stateSharedSpy.onEnter,
					stateASpy.onLeave,
					stateSharedSpy.onLeave,
					stateBSpy.onEnter,
					stateSharedSpy.onEnter,
				);

				done();
			});
			instance.init(templateName1, templateSlot, templateParams);
		});

		it('should throw if transition to the same state', (done) => {
			stateASpy.onEnter.callsFake((transition) => {
				transition('a')
					.then(() => assert(false))
					.catch((e) =>
						expect(e.message).to.equal(`Template ${templateName1} - already is in a state`),
					)
					.finally(() => done());
			});

			instance.init(templateName1, templateSlot, templateParams);
		});

		it('should throw if transition to not existing state', (done) => {
			stateASpy.onEnter.callsFake((transition) => {
				transition('wrong')
					.then(() => assert(false))
					.catch((e) => {
						expect(e.message).to.equal(`Template ${templateName1} - state (wrong) does not exist.`);
					})
					.finally(() => done());
			});

			instance.init(templateName1, templateSlot, templateParams);
		});

		it('should throw if transition twice', (done) => {
			stateASpy.onEnter.callsFake((transition) => {
				transition('b');
				transition('b')
					.then(() => assert(false))
					.catch(() => assert(true))
					.finally(() => done());
			});

			instance.init(templateName1, templateSlot, templateParams);
		});
	});
});
