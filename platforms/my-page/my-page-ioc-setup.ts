import { DiProcess } from '@wikia/ad-engine';
import { Container, Injectable } from '@wikia/dependency-injection';
import { MyPageTargetingSetup } from './setup/context/targeting/my-page-targeting.setup';

@Injectable()
export class MyPageIocSetup implements DiProcess {
	constructor(private container: Container) {}

	async execute(): Promise<void> {
		this.container.bind(MyPageTargetingSetup.skin('my-page-desktop'));
	}
}
