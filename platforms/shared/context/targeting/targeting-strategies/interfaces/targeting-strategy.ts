import { Targeting } from '@wikia/ad-engine';

export interface TargetingStrategy {
	execute(): Partial<Targeting>;
}
