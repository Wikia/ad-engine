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
	Nativo,
	slotImpactWatcher,
	slotService,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UcpMobileSlotsDefinitionRepository } from './ucp-mobile-slots-definition-repository';

@Injectable()
export class UcpMobileDynamicSlotsSetup implements DiProcess {
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
			this.slotsDefinitionRepository.getInterstitialConfig(),
			this.nativoSlotDefinitionRepository.getNativoFeedAdConfig({
				slotName: Nativo.FEED_AD_SLOT_NAME,
				anchorSelector: '.recirculation-prefooter',
				insertMethod: 'before',
				classList: ['ntv-ad', 'hide'],
			}),
		]);

		if (context.get('custom.hasFeaturedVideo')) {
			this.waitForFloorAdhesionInjection();
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
			slotsContext.addSlotSize(
				'top_leaderboard',
				universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.unified,
			);

			context.push('slots.top_leaderboard.defaultTemplates', 'stickyTlb');
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

	private isIncontentPlayerApplicable(): boolean {
		return (
			context.get('custom.hasIncontentPlayer') && context.get('wiki.targeting.pageType') !== 'home'
		);
	}

	private configureIncontentPlayer(): void {
		if (!this.isIncontentPlayerApplicable()) {
			return;
		}

		const slotName = 'incontent_player';

		communicationService.onSlotEvent(
			AdSlot.SLOT_RENDERED_EVENT,
			() => {
				insertSlots([this.slotsDefinitionRepository.getIncontentPlayerConfig()]);
			},
			'top_boxad',
			true,
		);

		communicationService.on(
			eventsRepository.AD_ENGINE_SLOT_ADDED,
			({ slot }) => {
				if (slot.getSlotName() === slotName) {
					slot.getPlaceholder()?.classList.remove('is-loading');

					const noTries = 2500;
					const retryTimeout = 500;

					new utils.WaitFor(() => slotImpactWatcher.isAvailable(6), noTries, 0, retryTimeout)
						.until()
						.then(() => {
							slotImpactWatcher.request({
								id: slotName,
								priority: 6,
								breakCallback: () => slot.getPlaceholder()?.classList.add('hide'),
							});
							communicationService.emit(eventsRepository.ANYCLIP_LATE_INJECT);
						});
				}
			},
			false,
		);
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

	private waitForFloorAdhesionInjection(): void {
		communicationService.onSlotEvent(
			AdSlot.STATUS_SUCCESS,
			() => {
				const playerContainer = document.getElementById('featured-video__player-container');

				if (!playerContainer) {
					return;
				}

				const noTries = 2500;
				const retryTimeout = 500;
				const scrollInterval = 100;
				const scrollBreakpoint = (playerContainer.offsetTop || 0) + scrollInterval;

				new utils.WaitFor(
					() =>
						window.scrollY > scrollBreakpoint &&
						!playerContainer.querySelector('div.is-on-scroll-active'),
					noTries,
					0,
					retryTimeout,
				)
					.until()
					.then(() => {
						insertSlots([this.slotsDefinitionRepository.getFloorAdhesionConfig()]);
					});
			},
			'featured',
			true,
		);
	}

	private registerFloorAdhesionCodePriority(): void {
		const slotName = 'floor_adhesion';
		let ntcOverride = false;
		let codePriorityActive = false;
		const disableFloorAdhesion = () => {
			slotService.disable(slotName);
			slotImpactWatcher.disable([slotName]);
			document.getElementById('floor_adhesion_anchor').classList.add('hide');
		};

		communicationService.on(eventsRepository.AD_ENGINE_UAP_NTC_LOADED, () => {
			ntcOverride = true;
		});

		slotImpactWatcher.request({
			id: slotName,
			priority: 4,
			breakCallback: disableFloorAdhesion,
		});

		communicationService.onSlotEvent(
			AdSlot.STATUS_COLLAPSE,
			() => slotImpactWatcher.disable([slotName]),
			slotName,
		);
		communicationService.onSlotEvent(
			AdSlot.STATUS_FORCED_COLLAPSE,
			() => slotImpactWatcher.disable([slotName]),
			slotName,
		);
		communicationService.onSlotEvent(
			AdSlot.STATUS_SUCCESS,
			() => {
				codePriorityActive = true;

				communicationService.on(
					eventsRepository.AD_ENGINE_INTERSTITIAL_DISPLAYED,
					() => {
						if (!codePriorityActive) {
							return;
						}

						slotImpactWatcher.request({
							id: 'interstitial',
							priority: 2,
						});
					},
					false,
				);

				communicationService.onSlotEvent(AdSlot.VIDEO_AD_IMPRESSION, () => {
					if (codePriorityActive && !ntcOverride) {
						disableFloorAdhesion();
					}
				});

				communicationService.onSlotEvent(
					AdSlot.CUSTOM_EVENT,
					({ payload }) => {
						if (payload.status === AdSlot.HIDDEN_EVENT) {
							codePriorityActive = false;
							slotImpactWatcher.disable([slotName, 'interstitial']);
						}
					},
					slotName,
				);
			},
			slotName,
		);
	}

	private registerAdPlaceholderService(): void {
		const messageBoxService = new MessageBoxService(context.get('services.messageBox.enabled'));
		const placeholderService = new PlaceholderService(messageBoxService);
		placeholderService.init();
	}
}
