import { BaseContextSetup } from '@platforms/shared';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class F2BaseContextSetup extends BaseContextSetup {
	configureBaseContext(isMobile: boolean = false): void {
		super.configureBaseContext(isMobile);
	}
}
