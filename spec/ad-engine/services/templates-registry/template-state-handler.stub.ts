import { TemplateStateHandler } from '@wikia/ad-engine';
import { SinonSandbox, SinonStub } from 'sinon';

export interface MinimalTemplateStateHandlerStub {
	onEnter: SinonStub & TemplateStateHandler['onEnter'];
}

export function createMinimalTemplateStateHandlerStub(
	sandbox: SinonSandbox,
): MinimalTemplateStateHandlerStub {
	return {
		onEnter: sandbox.stub().resolves(),
	};
}

export type TemplateStateHandlerStub = {
	[key in keyof TemplateStateHandler]: SinonStub & TemplateStateHandler[key];
};

export function createTemplateStateHandlerStub(sandbox: SinonSandbox): TemplateStateHandlerStub {
	return {
		onEnter: sandbox.stub().resolves(),
		onLeave: sandbox.stub().resolves(),
		onDestroy: sandbox.stub().resolves(),
	};
}
