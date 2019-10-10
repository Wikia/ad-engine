import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class StateSetup {
	configureState(isMobile: boolean): void {}
}
