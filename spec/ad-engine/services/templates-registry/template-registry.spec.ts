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
import { createSandbox, SinonSpy } from 'sinon';
import {
	createTemplateStateHandlerSpy,
	TemplateStateHandlerSpy,
} from './template-state-handler.spy';

describe('Template Registry', () => {
	const sandbox = createSandbox();
	let additionalDepsSpy: SinonSpy;
	let stateASpy: TemplateStateHandlerSpy;
	let stateBSpy: TemplateStateHandlerSpy;
	let stateSharedSpy: TemplateStateHandlerSpy;
	let container: Container;
	let instance: TemplateRegistry;

	@Injectable({ autobind: false })
	class AdditionalDependency {
		constructor(@Inject(TEMPLATE.NAME) public name: string) {
			additionalDepsSpy(name);
		}
	}

	@Injectable({ autobind: false })
	class StateAHandler implements TemplateStateHandler {
		constructor(
			@Inject(TEMPLATE.NAME) name: string,
			@Inject(TEMPLATE.SLOT) slot: AdSlot,
			@Inject(TEMPLATE.PARAMS) params: Dictionary,
			dep: AdditionalDependency,
		) {
			stateASpy.constructor(name, slot, params, dep);
		}

		async onEnter(transition: TemplateTransition<'b'>): Promise<void> {
			stateASpy.onEnter(transition);
		}

		async onLeave(): Promise<void> {
			stateASpy.onLeave();
		}

		async onDestroy(): Promise<void> {
			stateASpy.onDestroy();
		}
	}

	@Injectable({ autobind: false })
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

		async onDestroy(): Promise<void> {
			stateBSpy.onDestroy();
		}
	}

	@Injectable({ autobind: false })
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

		async onDestroy(): Promise<void> {
			stateSharedSpy.onDestroy();
		}
	}

	beforeEach(() => {
		additionalDepsSpy = sandbox.spy();
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
		expect(() => instance.init('mock', { getSlotName: () => 'mock' } as any)).to.throw(
			'Template mock was not registered',
		);
	});

	it('should not throw when initialized twice', () => {
		instance.register('mock', { a: [StateAHandler], b: [StateBHandler] }, 'a', [
			AdditionalDependency,
		]);
		instance.init('mock', { getSlotName: () => 'mock' } as any);
		instance.init('mock', { getSlotName: () => 'mock' } as any);

		assert(true);
	});

	it('should work with nested template dependencies', () => {
		instance.register('mock', { a: [StateAHandler], b: [StateBHandler] }, 'a', [
			[[AdditionalDependency]],
		]);
		instance.init('mock', { getSlotName: () => 'mock' } as any);
	});

	it('should throw without providing template dependencies', () => {
		instance.register('mock', { a: [StateAHandler], b: [StateBHandler] }, 'a');
		expect(() => instance.init('mock', { getSlotName: () => 'mock' } as any)).to.throw(
			`${AdditionalDependency.toString()} is not bound to anything`,
		);
	});

	it('should be able to register without template dependencies', () => {
		instance.register('mock', { a: [StateBHandler], b: [StateBHandler] }, 'a');
		instance.init('mock', { getSlotName: () => 'mock' } as any);
		assert(true);
	});

	describe('Initialized', () => {
		const templateName1 = 'foo';
		const templateSlot1: AdSlot = { slot: 'foo-slot', getSlotName: () => 'foo-slot' } as any;
		const templateParams1 = { params: 'foo-params' };
		const templateName2 = 'bar';
		const templateSlot2: AdSlot = { slot: 'bar-slot', getSlotName: () => 'bar-slot' } as any;
		const templateParams2 = { params: 'bar-params' };
		const template = {
			a: [StateAHandler, StateSharedHandler],
			b: [StateBHandler, StateSharedHandler],
		};

		beforeEach(() => {
			instance.register(templateName1, template, 'a', [AdditionalDependency]);
			instance.register(templateName2, template, 'a', [AdditionalDependency]);
		});

		it('should not start before init', () => {
			assert(stateASpy.constructor.notCalled);
			assert(additionalDepsSpy.notCalled);
			assert(stateBSpy.constructor.notCalled);
			assert(stateSharedSpy.constructor.notCalled);
		});

		it('should create all handlers on init', () => {
			instance.init(templateName1, templateSlot1, templateParams1);

			assert(stateASpy.constructor.calledOnce);
			assert(additionalDepsSpy.calledOnce);
			assert(stateBSpy.constructor.calledOnce);
			assert(stateSharedSpy.constructor.calledTwice);
		});

		it('should not throw when destroy non-existent', async () => {
			await instance.destroy('non-existent');

			assert(true, `Shouldn't throw`);
		});

		it('should create all handlers on init for two templates', () => {
			instance.init(templateName1, templateSlot1, templateParams1);
			instance.init(templateName2, templateSlot1, templateParams1);

			assert(stateASpy.constructor.calledTwice);
			assert(additionalDepsSpy.calledTwice);
			assert(stateBSpy.constructor.calledTwice);
			assert(stateSharedSpy.constructor.callCount === 4);
		});

		it('should destroy all machines on destroy of given slotName', async () => {
			instance.init(templateName1, templateSlot1, templateParams1);
			instance.init(templateName1, templateSlot1, templateParams1);
			instance.init(templateName2, templateSlot2, templateParams2);

			await instance.destroy(templateSlot1.getSlotName());

			assert(stateASpy.onLeave.calledTwice, 'stateASpy.onLeave.calledTwice');
			assert(stateSharedSpy.onLeave.calledTwice, 'stateSharedSpy.onLeave.calledTwice');
			assert(stateASpy.onDestroy.calledTwice, 'stateASpy.onDestroy.calledTwice');
			assert(stateBSpy.onDestroy.calledTwice, 'stateBSpy.onDestroy.calledTwice');
			assert(stateSharedSpy.onDestroy.callCount === 4, 'stateSharedSpy.onDestroy.callCount === 4');
		});

		it('should destroy all machines on destroyAll', async () => {
			instance.init(templateName1, templateSlot1, templateParams1);

			await instance.destroyAll();

			assert(stateASpy.onLeave.callCount, 'stateASpy.onLeave.callCount');
			assert(stateBSpy.onLeave.notCalled, 'stateBSpy.onLeave.notCalled');
			assert(stateSharedSpy.onLeave.calledOnce, 'stateSharedSpy.onLeave.calledOnce');
			assert(stateASpy.onDestroy.calledOnce, 'stateASpy.onDestroy.calledOnce');
			assert(stateBSpy.onDestroy.calledOnce, 'stateBSpy.onDestroy.calledOnce');
			assert(stateSharedSpy.onDestroy.calledTwice, 'stateSharedSpy.onDestroy.calledTwice');
			sandbox.assert.callOrder(
				stateASpy.onLeave,
				stateSharedSpy.onLeave,
				stateASpy.onDestroy,
				stateSharedSpy.onDestroy,
				stateBSpy.onDestroy,
				stateSharedSpy.onDestroy,
			);
		});

		it('should throw then trying get deps after init', () => {
			instance.init(templateName1, templateSlot1, templateParams1);

			expect(() => container.get(TEMPLATE.NAME)).to.throw(
				`${TEMPLATE.NAME.toString()} is not bound to anything`,
			);
			expect(() => container.get(TEMPLATE.SLOT)).to.throw(
				`${TEMPLATE.SLOT.toString()} is not bound to anything`,
			);
			expect(() => container.get(TEMPLATE.PARAMS)).to.throw(
				`${TEMPLATE.PARAMS.toString()} is not bound to anything`,
			);
		});

		it('should be able inject correct params', () => {
			instance.init(templateName1, templateSlot1, templateParams1);

			const [name, slot, params, dep] = stateASpy.constructor.getCall(0).args;

			expect(name).to.equal(templateName1);
			expect(slot).to.equal(templateSlot1);
			expect(params).to.equal(templateParams1);
			assert(additionalDepsSpy.calledOnce);
			expect(dep instanceof AdditionalDependency).to.true;
			expect(dep.name).to.equal(templateName1);
		});

		it('should be able inject correct params to different templates', () => {
			instance.init(templateName1, templateSlot1, templateParams1);
			instance.init(templateName2, templateSlot2, templateParams2);

			const [name1, slot1, params1, dep1] = stateASpy.constructor.getCall(0).args;
			const [name2, slot2, params2, dep2] = stateASpy.constructor.getCall(1).args;

			expect(name1).to.equal(templateName1);
			expect(slot1).to.equal(templateSlot1);
			expect(params1).to.equal(templateParams1);
			assert(dep1 instanceof AdditionalDependency);
			expect(name2).to.equal(templateName2);
			expect(slot2).to.equal(templateSlot2);
			expect(params2).to.equal(templateParams2);
			assert(dep2 instanceof AdditionalDependency);
			assert(dep1 !== dep2);
			assert(additionalDepsSpy.calledTwice);
		});

		it('should enter initial state', () => {
			instance.init(templateName1, templateSlot1, templateParams1);

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
			instance.init(templateName1, templateSlot1, templateParams1);
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

			instance.init(templateName1, templateSlot1, templateParams1);
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

			instance.init(templateName1, templateSlot1, templateParams1);
		});

		it('should throw if transition twice', (done) => {
			stateASpy.onEnter.callsFake((transition) => {
				transition('b');
				transition('b')
					.then(() => assert(false))
					.catch(() => assert(true))
					.finally(() => done());
			});

			instance.init(templateName1, templateSlot1, templateParams1);
		});
	});
});
