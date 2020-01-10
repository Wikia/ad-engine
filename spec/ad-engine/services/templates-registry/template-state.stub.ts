import { TemplateState } from '@wikia/ad-engine/services/templates-registry/template-state';
import { Observable, Subject } from 'rxjs';
import { SinonSandbox, SinonStub } from 'sinon';

export type TemplateStateStub = {
	[key in keyof Omit<TemplateState<string>, 'transition$'>]: SinonStub & TemplateState<string>[key]
} & { transition$: Observable<string>; transitionSubject$: Subject<string> };

export function createTemplateStaterStub(sandbox: SinonSandbox): TemplateStateStub {
	const transitionSubject$ = new Subject<string>();

	return {
		transitionSubject$,
		transition$: transitionSubject$.asObservable(),
		enter: sandbox.stub().resolves(),
		leave: sandbox.stub().resolves(),
	};
}
