export class Tcf {
	defaultVersion = 0;

	get exists(): boolean {
		return !!window.__tcfapi;
	}

	getTCData(version?: number): Promise<TCData> {
		return new Promise((resolve) => {
			window.__tcfapi('addEventListener', version || this.defaultVersion, (tcData) =>
				resolve(tcData),
			);
		});
	}

	override(newTcf: WindowTCF): void {
		window.__tcfapi = newTcf;
	}
}

export const tcf = new Tcf();
