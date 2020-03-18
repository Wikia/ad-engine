import {
	AdSlot,
	Porvata,
	PorvataTemplateParams,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	UapParams,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { PlayerRegistry } from '../../helpers/player-registry';
import { VideoBootstrapHelper } from '../../helpers/video-bootstrap-helper';

@Injectable()
export class BfabBootstrapVideoHandler implements TemplateStateHandler {
	private helper: VideoBootstrapHelper;

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		private playerRegistry: PlayerRegistry,
	) {
		this.helper = new VideoBootstrapHelper(this.params, this.adSlot);
	}

	async onEnter(transition: TemplateTransition<'impact'>): Promise<void> {
		if (!universalAdPackage.isVideoEnabled(this.params)) {
			return;
		}

		const playerParams: PorvataTemplateParams = this.helper.getPlayerParams();

		this.adSlot.addClass('theme-hivi'); // Required by replay-overlay
		this.helper.setCtpTargeting();

		Porvata.inject(playerParams).then((video) => {
			this.playerRegistry.register(video);
			this.helper.handleRestart(video, transition);
			this.helper.handleEvents(video);
			this.helper.adjustUI(video, playerParams.container, playerParams);
		});
	}

	async onLeave(): Promise<void> {}
}
