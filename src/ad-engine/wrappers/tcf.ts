interface TCFv2ApiPayload {
	gdprApplies: boolean;
	tcString: string;
}

export class Tcf {
	payload: TCFv2ApiPayload = null;
	defaultVersion = 2;

	init(): Promise<void> {
		if (this.exists) {
			return this.getTCData().then((tcData: TCData) => {
				this.payload = {
					gdprApplies: tcData.gdprApplies,
					tcString: tcData.tcString,
				};
			});
		}

		return Promise.resolve();
	}

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
