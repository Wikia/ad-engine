import { slotsContext } from '@platforms/shared';
import {
	context,
	DiProcess,
	getAdUnitString,
	globalRuntimeVariableSetter,
	InstantConfigService,
	slotService,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDesktopSlotsStateSetup implements DiProcess {
	constructor(private instantConfig: InstantConfigService) {}

	execute(): void {
		slotsContext.setState('top_leaderboard', true);
		slotsContext.setState('top_boxad', this.isRightRailApplicable());
		slotsContext.setState('bottom_leaderboard', true);
		slotsContext.setState(
			'floor_adhesion',
			this.instantConfig.get('icFloorAdhesion') && !context.get('custom.hasFeaturedVideo'),
		);
		slotsContext.setState(
			'invisible_high_impact_2',
			!this.instantConfig.get('icFloorAdhesion') && !context.get('custom.hasFeaturedVideo'),
		);

		slotService.setState('featured', context.get('custom.hasFeaturedVideo'));

		if (context.get('services.distroScale.enabled')) {
			this.setupIncontentPlayerForDistroScale();
		} else {
			slotsContext.setState('incontent_player', context.get('custom.hasIncontentPlayer'));
		}
	}

	private setDistroscaleVarInRuntime(slotName: string): void {
		const params = {
			group: 'VIDEO',
			adProduct: 'incontent_video',
			slotNameSuffix: '',
		};

		const distroscaleIU = getAdUnitString(slotName, params);

		globalRuntimeVariableSetter.addNewVariableToRuntime('distroscale', { adUnit: distroscaleIU });
	}

	private setupIncontentPlayerForDistroScale(): void {
		const slotName = 'incontent_player';
		this.setDistroscaleVarInRuntime(slotName);
		context.set('slots.incontent_player.targeting.pos', ['incontent_video']);
	}

	private isRightRailApplicable(): boolean {
		return utils.getViewportWidth() >= 1024;
	}
}
