import { DiProcess, parallel, ProcessPipeline, sequential } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { PlatformFactory } from '../../platform.factory';
import { ConsentManagementPlatformSetup } from '../consent/consent-management-platform.setup';
import { ensureGeoCookie } from '../ensure-geo-cookie';
import { InstantConfigSetup } from '../utils/instant-config.setup';
import { PreloadedLibrariesSetup } from './preloaded-libraries-setup';

@Injectable()
export class PlatformSetup implements DiProcess {
	constructor(
		private pipeline: ProcessPipeline,
		private readonly platformFactory: PlatformFactory,
	) {}

	async execute(): Promise<void> {
		const platform = window.ads?.context?.app;

		if (!platform) {
			throw new Error('Platform is not defined in window.ads.context!');
		}

		const pipeline = await this.platformFactory.get(platform);

		this.pipeline.add(
			async () => await ensureGeoCookie(),
			parallel(
				sequential(InstantConfigSetup, PreloadedLibrariesSetup),
				ConsentManagementPlatformSetup,
			),
		);
		this.pipeline.execute().then(() => pipeline.execute());
	}
}
