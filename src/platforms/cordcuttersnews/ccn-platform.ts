import { Injectable } from '@wikia/dependency-injection';
import {
	communicationService,
	context,
	eventsRepository,
	utils,
	ProcessPipeline,
} from '@wikia/ad-engine';
import { getDeviceMode, gptSetup } from '@platforms/shared';
import { basicContext } from './ad-context';

import { CcnSlotsContextSetup } from './setup/context/slots/ccn-slots-context.setup';
import { CcnDynamicSlotsSetup } from './setup/dynamic-slots/ccn-dynamic-slots.setup';

@Injectable()
export class CcnPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			() => context.set('state.isMobile', getDeviceMode() === 'mobile'),
			() => context.set('custom.dfpId', this.shouldSwitchGamToRV() ? 4788 : 5441),
			() => context.set('src', this.shouldSwitchSrcToTest() ? ['test'] : context.get('src')),
			// TODO: do we need a CMP step here if the CCN does not have it now? ;-)
			// TODO: to decide if we want to call instant-config service for the first releases?
			CcnSlotsContextSetup,
			CcnDynamicSlotsSetup,
			// TODO: add targeting setup once we have idea of page-level and slot-level targeting
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
			gptSetup.call,
		);

		this.pipeline.execute();
	}

	private shouldSwitchGamToRV() {
		return utils.queryString.get('switch_to_rv_gam') === '1';
	}

	private shouldSwitchSrcToTest() {
		return utils.queryString.get('switch_src_to_test') === '1';
	}
}
