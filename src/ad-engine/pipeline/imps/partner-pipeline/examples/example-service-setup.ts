import { BaseServiceSetup } from '../base-service-setup';

class ExampleServiceSetup extends BaseServiceSetup {
	initialize() {
		this.res();
	}
}

export const exampleServiceSetup = new ExampleServiceSetup();
export const exampleServiceSetupWithDeps = new ExampleServiceSetup();
