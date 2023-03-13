export class RuntimeVariableSetter {
	addVariable(name, value): void {
		window.ads.runtime = window.ads.runtime || ({} as Runtime);
		window.ads.runtime[name] = value;
	}
}

export const runtimeVariableSetter = new RuntimeVariableSetter();
