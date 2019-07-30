export class Cmp {
	get exists(): boolean {
		return !!window.__cmp;
	}

	getConsentData(param?: unknown): Promise<ConsentData> {
		return new Promise((resolve) => {
			window.__cmp('getConsentData', param, (consentData) => resolve(consentData));
		});
	}

	override(newCmp: WindowCMP): void {
		window.__cmp = newCmp;
	}
}

export const cmp = new Cmp();
