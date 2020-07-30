import { TemplateState } from '@wikia/ad-engine/services/templates-registry/template-state';
import { SinonSandbox, SinonStub } from 'sinon';

export type TemplateStateStub = {
	[key in keyof TemplateState<string>]: SinonStub & TemplateState<string>[key];
};

export function createTemplateStateStub(sandbox: SinonSandbox): TemplateStateStub {
	return {
		enter: sandbox.stub().resolves(),
		leave: sandbox.stub().resolves(),
		destroy: sandbox.stub().resolves(),
	};
}
