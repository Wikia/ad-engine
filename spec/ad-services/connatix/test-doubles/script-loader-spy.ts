import sinon, { SinonStubbedInstance } from 'sinon';

class ScriptLoaderSpy {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	loadScript(src: string): Promise<Event> {
		return undefined;
	}
}

export function makeScriptLoaderSpy(): SinonStubbedInstance<ScriptLoaderSpy> {
	const stub = sinon.createStubInstance(ScriptLoaderSpy);
	stub.loadScript.returns(Promise.resolve(undefined));
	return stub;
}
