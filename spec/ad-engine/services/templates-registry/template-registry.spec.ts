import {
	AdSlot,
	Dictionary,
	TEMPLATE,
	TemplateRegistry,
	TemplateStateHandler,
	TemplateTransition,
} from '@wikia/ad-engine';
import { Container, Inject, Injectable } from '@wikia/dependency-injection';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { createTemplateStateHandlerSpy } from './template-state-handler.spy';

describe('Template Registry', () => {
	const sandbox = createSandbox();
	const stateASpy = createTemplateStateHandlerSpy(sandbox);
	const stateBSpy = createTemplateStateHandlerSpy(sandbox);
	const stateSharedSpy = createTemplateStateHandlerSpy(sandbox);
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
});
