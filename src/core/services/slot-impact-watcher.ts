interface ImpactDetails {
	id: string;
	priority: number;
	breakCallback?: () => void;
}

export class SlotImpactWatcher {
	private activeImpact: ImpactDetails | null = null;

	public isAvailable(priority: number) {
		return !this.activeImpact || this.activeImpact.priority > priority;
	}

	public request(details: ImpactDetails): boolean {
		if (this.activeImpact) {
			if (this.activeImpact.priority < details.priority) {
				return false;
			}

			if (this.activeImpact.breakCallback) {
				this.activeImpact.breakCallback();
			}
		}

		this.activeImpact = details;

		return true;
	}

	public disable(idsToDisable: string | string[]) {
		if (Array.isArray(idsToDisable)) {
			idsToDisable.forEach((id) => {
				this.disable(id);
			});
		}

		if (!this.activeImpact || this.activeImpact.id === idsToDisable) {
			this.activeImpact = null;
		}
	}
}

export const slotImpactWatcher = new SlotImpactWatcher();
