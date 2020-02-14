export class Usp {
	get exists(): boolean {
		return !!window.__uspapi;
	}

	getSignalData(param?: unknown): Promise<SignalData> {
		return new Promise((resolve) => {
			window.__uspapi('getUSPData', param, (signalData) => resolve(signalData));
		});
	}

	override(newUsp: WindowUSP): void {
		window.__uspapi = newUsp;
	}
}

export const usp = new Usp();
