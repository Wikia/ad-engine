import { SinonSandbox, SinonStubbedInstance } from 'sinon';

export function createHtmlElementStub<K extends keyof HTMLElementTagNameMap>(
	sandbox: SinonSandbox,
	tagName: K,
	options?: ElementCreationOptions,
): SinonStubbedInstance<HTMLElementTagNameMap[K]> {
	return sandbox.stub(document.createElement(tagName, options));
}
