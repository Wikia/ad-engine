import {
	communicationService,
	DiProcess,
	globalAction,
	InstantConfigService,
} from '@wikia/ad-engine';
import { Container, Injectable } from '@wikia/dependency-injection';
import { props } from 'ts-action';

const setInstantConfig = globalAction(
	'[AdEngine] set InstantConfig',
	props<{ instantConfig: InstantConfigService }>(),
);

@Injectable()
export class InstantConfigSetup implements DiProcess {
	constructor(private container: Container) {}

	async execute(): Promise<void> {
		const instantConfig = await InstantConfigService.init();

		this.container.bind(InstantConfigService).value(instantConfig);
		communicationService.dispatch(setInstantConfig({ instantConfig }));
	}
}
