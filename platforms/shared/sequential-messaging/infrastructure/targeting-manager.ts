import { TargetingManagerInterface } from '../domain/interfaces/targeting-manager.interface';
import { ContextInterface } from '@wikia/ad-engine';

export class TargetingManager implements TargetingManagerInterface {
	constructor(private context: ContextInterface) {}

	setTargeting(adTargeting: Record<string, any>): void {
		for (const [key, val] of Object.entries(adTargeting)) {
			this.context.set('targeting.' + key, val);
		}
	}
}
