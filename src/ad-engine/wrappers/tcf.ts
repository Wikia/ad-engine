export class Tcf {
	defaultVersion = 2;

	get exists(): boolean {
		return !!window.__tcfapi;
	}

	getTCData(version?: number): Promise<TCData> {
		return new Promise((resolve) => {
			window.__tcfapi('getTCData', version || this.defaultVersion, (tcData) => resolve(tcData));
		});
	}

	override(newTcf: WindowTCF): void {
		window.__tcfapi = newTcf;
	}
}

export const tcf = new Tcf();
