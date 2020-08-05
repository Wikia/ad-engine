import { BaseContextSetup, bootstrapAndGetConsent } from '@platforms/shared';
import { context, parallel, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { BingeBotIocSetup } from './bingebot-ioc-setup';
import { BingeBotSlotsContextSetup } from './setup/context/slots/bingebot-slots-context.setup';
import { BingeBotSlotsStateSetup } from './setup/state/slots/bingebot-slots-state-setup';

@Injectable()
export class BingeBotPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			parallel(BingeBotIocSetup, () => bootstrapAndGetConsent()),
			BaseContextSetup,
			BingeBotSlotsContextSetup,
			BingeBotSlotsStateSetup,
		);

		this.pipeline.execute();
	}
}
