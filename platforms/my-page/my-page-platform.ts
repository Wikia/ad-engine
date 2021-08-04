import { bootstrapAndGetConsent, startAdEngine } from '@platforms/shared';
import { context, parallel, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { MyPageIocSetup } from './my-page-ioc-setup';
import { MyPageSlotsContextSetup } from './setup/context/slots/my-page-slots-context.setup';
import { MyPageTargetingSetup } from './setup/context/targeting/my-page-targeting.setup';
import { MyPageDynamicSlotsSetup } from './setup/dynamic-slots/my-page-dynamic-slots.setup';
import { MyPageSlotsStateSetup } from './setup/state/slots/my-page-slots-state-setup';

@Injectable()
export class MyPagePlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			parallel(MyPageIocSetup, () => bootstrapAndGetConsent()),
			MyPageTargetingSetup,
			MyPageSlotsContextSetup,
			MyPageSlotsStateSetup,
			() => {
				context.push('state.adStack', { id: 'top_leaderboard' });

				startAdEngine();
			},
			MyPageDynamicSlotsSetup,
		);

		this.pipeline.execute();
	}
}
