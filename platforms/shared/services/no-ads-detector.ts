import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class NoAdsDetector {
	private reasons: string[] = [];

	isAdsMode(): boolean {
		return !this.reasons.length;
	}

	getReasons(): string[] {
		return [...this.reasons];
	}

	addReason(reason: string): void {
		this.reasons.unshift(reason);
	}

	reset(): void {
		this.reasons = [];
	}
}
