import { ScriptLoaderInterface, ScriptTagOptions } from '@wikia/ad-engine/utils';
import sinon, { SinonStubbedInstance } from 'sinon';

class ScriptLoaderSpy implements ScriptLoaderInterface {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	loadScript(src: string, options?: ScriptTagOptions): Promise<Event> {
		return undefined;
	}

	/* eslint-disable @typescript-eslint/no-unused-vars */
	createScript(src: string, options?: ScriptTagOptions): HTMLScriptElement {
		return undefined;
	}

	/* eslint-disable @typescript-eslint/no-unused-vars */
	loadAsset(url: string, responseType: XMLHttpRequestResponseType): Promise<string | null> {
		return undefined;
	}
}

export function makeScriptLoaderSpy(): SinonStubbedInstance<ScriptLoaderSpy> {
	const stub = sinon.createStubInstance(ScriptLoaderSpy);
	stub.loadScript.returns(Promise.resolve(undefined));
	return stub;
}
