import { DiProcess } from '@wikia/ad-engine';
import { Container, Injectable } from '@wikia/dependency-injection';
import { TestPageTargetingSetup } from './setup/context/targeting/test-page-targeting.setup';

@Injectable()
export class TestPageIocSetup implements DiProcess {
	constructor(private container: Container) {}

	async execute(): Promise<void> {
		this.container.bind(TestPageTargetingSetup.skin('my-page-desktop'));
	}
}
