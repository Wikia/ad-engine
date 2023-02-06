import { DiProcess } from '@wikia/ad-engine';
import { Container, Injectable } from '@wikia/dependency-injection';
import { JbienkowskiPageTargetingSetup } from './setup/context/targeting/jbienkowski-page-targeting.setup';

@Injectable()
export class JbienkowskiPageIocSetup implements DiProcess {
	constructor(private container: Container) {}

	execute(): void {
		this.container.bind(JbienkowskiPageTargetingSetup.skin('jbienkowski-page-desktop'));
	}
}
