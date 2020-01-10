import { TemplateMachine } from '@wikia/ad-engine/services/templates-registry/template-machine';
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
			'templateName',
			new Map([['a', stateA], ['b', stateB]]) as any,
			'stateKey',
		);
	});

	afterEach(() => {
		sandbox.reset();
	});
});
