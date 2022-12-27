import { debug } from './debug';
import { Injectable } from '@wikia/dependency-injection';
import { ContextCallbacksService } from './context-callbacks-service';

@Injectable()
export class TargetingService {
	private groupName = 'TargetingService';

	constructor(private adTargeting = {}, private contextCallbackService: ContextCallbacksService) {
		window.ads.adTargeting = debug.isDebugMode() ? {} : this.adTargeting;
	}

	get(key: string) {
		return this.adTargeting[key];
	}

	set(key: string, value: any) {
		this.adTargeting[key] = value;
	}

	remove(key: string) {
		if (this.adTargeting[key] !== undefined) {
			delete this.adTargeting[key];
			this.contextCallbackService.removeListeners(this.groupName, key);
		}
	}
}
