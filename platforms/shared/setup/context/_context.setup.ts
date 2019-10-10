import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class ContextSetup {
	configureContext(isOptedIn = false): void {}
}
