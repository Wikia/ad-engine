import { AdSlot, Dictionary } from '@ad-engine/core';
import { TrackingBidDefinition } from '@ad-engine/communication';

export interface BaseTrackerInterface {
	isEnabled: () => boolean;
	register: (callback: (data: Dictionary) => void, resources: Dictionary) => void | (() => void);
}

export interface CompilerPartial {
	bid?: TrackingBidDefinition;
	data: Dictionary;
	slot?: AdSlot;
}

export class BaseTracker {
	protected disabled = false;
	protected compilers: ((CompilerPartial) => CompilerPartial)[] = [];

	protected disable(): void {
		this.disabled = true;
	}

	protected addCompiler(compiler): void {
		this.compilers.push(compiler);
	}

	protected compileData(slot = null, bid = null, data = {}) {
		let trackingData: CompilerPartial = {
			bid,
			slot,
			data,
		};

		this.compilers.forEach((compiler) => {
			trackingData = compiler(trackingData);
		});

		return trackingData;
	}
}
