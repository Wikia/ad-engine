import { SinonSandbox, SinonSpy } from 'sinon';

export interface TemplateStateHandlerSpy {
	constructor: SinonSpy;
	onEnter: SinonSpy;
	onLeave: SinonSpy;
}

export function createTemplateStateHandlerSpy(sandbox: SinonSandbox): TemplateStateHandlerSpy {
	return {
		constructor: sandbox.spy(),
		onEnter: sandbox.spy(),
		onLeave: sandbox.spy(),
	};
}
