export class GlobalRuntimeVariableSetter {
	addNewVariableToRuntime(name, value): void {
		window.ads.runtime = window.ads.runtime || ({} as Runtime);
		window.ads.runtime[name] = value;
	}
}

export const globalRuntimeVariableSetter = new GlobalRuntimeVariableSetter();
