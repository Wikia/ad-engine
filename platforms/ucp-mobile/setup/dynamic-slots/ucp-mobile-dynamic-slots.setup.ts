import {
	insertSlots,
	MessageBoxService,
	NativoSlotsDefinitionRepository,
	PlaceholderService,
	QuizSlotsDefinitionRepository,
	slotsContext,
} from '@platforms/shared';
import {
	AdSlot,
	btfBlockerService,
	communicationService,
	context,
	CookieStorageAdapter,
	DiProcess,
	eventsRepository,
	fillerService,
	Nativo,
	PorvataFiller,
	slotService,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UcpMobileSlotsDefinitionRepository } from './ucp-mobile-slots-definition-repository';

@Injectable()
export class UcpMobileDynamicSlotsSetup implements DiProcess {
	private CODE_PRIORITY = {
		floor_adhesion: {
			active: false,
			ignore: false,
		},
	};

	constructor(
		private slotsDefinitionRepository: UcpMobileSlotsDefinitionRepository,
		private nativoSlotDefinitionRepository: NativoSlotsDefinitionRepository,
		private quizSlotsDefinitionRepository: QuizSlotsDefinitionRepository,
	) {}

	execute(): void {
		this.injectSlots();
		this.configureTopLeaderboardAndCompanions();
		this.configureIncontentPlayer();
		this.configureInterstitial();
		this.registerFloorAdhesionCodePriority();
		this.registerAdPlaceholderService();
	}

	private injectSlots(): void {
		const topLeaderboardDefinition = this.slotsDefinitionRepository.getTopLeaderboardConfig();

		insertSlots([
			topLeaderboardDefinition,
			this.nativoSlotDefinitionRepository.getNativoIncontentAdConfig(4),
			this.slotsDefinitionRepository.getTopBoxadConfig(),
			this.slotsDefinitionRepository.getIncontentBoxadConfig(),
			this.slotsDefinitionRepository.getBottomLeaderboardConfig(),
			this.slotsDefinitionRepository.getMobilePrefooterConfig(),
			this.slotsDefinitionRepository.getInvisibleHighImpactConfig(),
			this.slotsDefinitionRepository.getInterstitialConfig(),
			this.nativoSlotDefinitionRepository.getNativoFeedAdConfig({
				slotName: Nativo.FEED_AD_SLOT_NAME,
				anchorSelector: '.recirculation-prefooter',
				insertMethod: 'before',
				classList: ['ntv-ad', 'hide'],
			}),
		]);

		if (context.get('custom.hasFeaturedVideo')) {
			communicationService.on(eventsRepository.AD_ENGINE_UAP_NTC_LOADED, () => {
				const noTries = 2500;
				const retryTimeout = 500;

				new utils.WaitFor(
					() =>
						!document.querySelector('body').classList.contains('featured-video-on-scroll-enabled'),
					noTries,
					0,
					retryTimeout,
				)
					.until()
					.then(() => {
						insertSlots([this.slotsDefinitionRepository.getFloorAdhesionConfig()]);
					});
			});
		} else {
			insertSlots([this.slotsDefinitionRepository.getFloorAdhesionConfig()]);
		}

		if (!topLeaderboardDefinition) {
			communicationService.on(eventsRepository.AD_ENGINE_STACK_START, () => {
				btfBlockerService.finishFirstCall();
				communicationService.emit(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, {
					isLoaded: universalAdPackage.isFanTakeoverLoaded(),
					adProduct: universalAdPackage.getType(),
				});
			});
		}

		communicationService.on(
			eventsRepository.QUIZ_AD_INJECTED,
			(payload) => {
				insertSlots([this.quizSlotsDefinitionRepository.getQuizAdConfig(payload.slotId)]);
			},
			false,
		);
	}

	private configureTopLeaderboardAndCompanions(): void {
		if (
			!context.get('custom.hasFeaturedVideo') &&
			context.get('wiki.targeting.pageType') !== 'search'
		) {
			slotsContext.addSlotSize(
				'top_leaderboard',
				universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.mobile,
			);

			if (context.get('templates.stickyTlb.lineItemIds')) {
				context.push('slots.top_leaderboard.defaultTemplates', 'stickyTlb');
			}
		}

		slotsContext.addSlotSize(
			'top_boxad',
			universalAdPackage.UAP_ADDITIONAL_SIZES.companionSizes['4x4'].size,
		);
		slotsContext.addSlotSize(
			'incontent_boxad_1',
			universalAdPackage.UAP_ADDITIONAL_SIZES.companionSizes['4x4'].size,
		);
		slotsContext.addSlotSize(
			'mobile_prefooter',
			universalAdPackage.UAP_ADDITIONAL_SIZES.companionSizes['4x4'].size,
		);
	}

	private configureIncontentPlayer(): void {
		const icpSlotName = 'incontent_player';

		if (
			!context.get('custom.hasIncontentPlayer') ||
			context.get('wiki.targeting.pageType') === 'home'
		) {
			context.set(`slots.${icpSlotName}.disabled`, true);
		}

		context.set(`slots.${icpSlotName}.customFiller`, 'porvata');
		context.set(`slots.${icpSlotName}.customFillerOptions`, {});

		fillerService.register(new PorvataFiller());
	}

	private configureInterstitial(): void {
		const setInterstitialCapping = () => {
			const cookieAdapter = new CookieStorageAdapter();
			cookieAdapter.setItem('_ae_intrsttl_imp', '1');
		};

		communicationService.onSlotEvent(
			AdSlot.SLOT_VIEWED_EVENT,
			() => {
				communicationService.emit(eventsRepository.AD_ENGINE_INTERSTITIAL_DISPLAYED);
				setInterstitialCapping();
			},
			'interstitial',
		);

		communicationService.on(eventsRepository.GAM_INTERSTITIAL_LOADED, () => {
			setInterstitialCapping();
		});
	}

	private registerFloorAdhesionCodePriority(): void {
		const slotName = 'floor_adhesion';
		const disableFloorAdhesionWithStatus = (status: string) => {
			this.CODE_PRIORITY.floor_adhesion.active = false;
			slotService.disable(slotName, status);
			document.getElementById('floor_adhesion_anchor').classList.add('hide');
		};

		communicationService.onSlotEvent(
			AdSlot.STATUS_SUCCESS,
			() => {
				this.CODE_PRIORITY.floor_adhesion.active = true;

				communicationService.on(eventsRepository.AD_ENGINE_UAP_NTC_LOADED, () => {
					this.CODE_PRIORITY.floor_adhesion.ignore = true;
				});

				communicationService.onSlotEvent(AdSlot.VIDEO_AD_IMPRESSION, () => {
					if (
						!this.CODE_PRIORITY.floor_adhesion.ignore &&
						this.CODE_PRIORITY.floor_adhesion.active
					) {
						disableFloorAdhesionWithStatus(AdSlot.STATUS_CLOSED_BY_PORVATA);
					}
				});

				communicationService.on(
					eventsRepository.AD_ENGINE_INTERSTITIAL_DISPLAYED,
					() => {
						if (this.CODE_PRIORITY.floor_adhesion.active) {
							disableFloorAdhesionWithStatus(AdSlot.STATUS_CLOSED_BY_INTERSTITIAL);
						}
					},
					false,
				);
			},
			slotName,
		);

		communicationService.onSlotEvent(
			AdSlot.HIDDEN_EVENT,
			() => {
				this.CODE_PRIORITY.floor_adhesion.active = false;
			},
			slotName,
		);
	}

	private registerAdPlaceholderService(): void {
		const messageBoxService = new MessageBoxService();
		const placeholderService = new PlaceholderService(messageBoxService);
		placeholderService.init();
	}
}
