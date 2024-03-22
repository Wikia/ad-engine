// import { AdSlotEventPayload } from "../../../communication/event-types";
// import { AdSlotEvent } from "../../../core/models/ad-slot-event";
// import { AdSlotStatus } from "../../../core/models/ad-slot-status";
import { context } from "../../../core/services/context-service";
import { runtimeVariableSetter } from "../../../core/wrappers/global-variable-setter";
import { client } from "../../../core/utils/client";
// import { AD_ENGINE_UAP_LOAD_STATUS } from "../../../communication/events/events-ad-engine-uap";
// import { AD_ENGINE_SLOT_EVENT } from "../../../communication/events/events-ad-engine-slot";
import * as constants from "../../../ad-products/templates/uap/constants";
import { targetingService } from "../../../core/services/targeting-service";
// import { communicationServiceSlot } from "./communication-service-slot";
import { communicationServiceSlim } from "./communication-service-slim";
import { AD_ENGINE_UAP_UNLOCK } from "../../../communication/events/events-ad-engine-uap";

// eslint-disable-next-line
let uapCreativeId = constants.DEFAULT_UAP_ID;
let uapId = constants.DEFAULT_UAP_ID;
let uapType = constants.DEFAULT_UAP_TYPE;

export interface UapState<T> {
    default: T;
    resolved: T;
}

export type UapRatio = UapState<number>;

export interface UapConfig {
    aspectRatio: UapRatio;
    background: UapState<string>;
    video: {
        thumb: string;
    };
    state: {
        height: UapState<number>;
        top?: UapState<number>;
        right?: UapState<number>;
        bottom?: UapState<number>;
        width?: UapState<number>;
    };
}

export interface UapImage {
    element: HTMLImageElement;
    background?: string;
}

export interface UapParams {
    adContainer: HTMLElement;
    adProduct: string;
    autoPlay: boolean;
    clickThroughURL: string;
    config: UapConfig;
    container: HTMLElement;
    creativeId: string;
    image1: UapImage;
    image2?: UapImage;
    isDarkTheme: boolean;
    isMobile: boolean;
    lineItemId: string;
    newTakeoverConfig: boolean;
    sequentialUapConfig: boolean;
    slotName: string;
    src: string;
    uap: string;
    height: number;
    width: number;
    thumbnail: HTMLElement;
    useVideoSpecialAdUnit: boolean;
}

function getUapId(): string {
    return uapId;
}

function setIds(lineItemId, creativeId): void {
    uapId = lineItemId || constants.DEFAULT_UAP_ID;
    uapCreativeId = creativeId || constants.DEFAULT_UAP_ID;

    updateSlotsTargeting(uapId, uapCreativeId);
    console.log('>>> UAP pkg >>> ', uapId, uapType, uapCreativeId);
}

function getType(): string {
    return uapType;
}

function setType(type): void {
    uapType = type;
}

function updateSlotsTargeting(lineItemId, creativeId): void {
    const slots = context.get('slots') || {};

    Object.keys(slots).forEach((slotId) => {
        targetingService.set('uap', lineItemId, slotId);
        targetingService.set('uap_c', creativeId, slotId);
    });
}
//
// function enableSlots(slotsToEnable): void {
//     slotsToEnable.forEach((slotName) => {
//         btfBlockerService.unblock(slotName);
//     });
// }
//
// function disableSlots(slotsToDisable): void {
//     slotsToDisable.forEach((slotName) => {
//         slotService.disable(slotName);
//     });
// }

function initSlot(params: UapParams): void {
    if (params.isDarkTheme) {
        params.container.classList.add('is-dark');
    }

    if (params.isMobile) {
        params.container.classList.add('is-mobile-layout');
    }

    if (client.isSmartphone() || client.isTablet()) {
        params.container.classList.add('is-mobile-device');
    }

    if (params.useVideoSpecialAdUnit) {
        context.set(`slots.${this.config.slotName}.videoAdUnit`, constants.SPECIAL_VIDEO_AD_UNIT);
    }
}

function reset(): void {
    setType(constants.DEFAULT_UAP_TYPE);
    setIds(constants.DEFAULT_UAP_ID, constants.DEFAULT_UAP_ID);
}

// function isFanTakeoverLoaded(): boolean {
//     return (
//         getUapId() !== constants.DEFAULT_UAP_ID &&
//         constants.FAN_TAKEOVER_TYPES.indexOf(<'uap'|'vuap'>getType()) !== -1
//     );
// }

export const universalAdPackage = {
    ...constants,
    init(params: UapParams): void {
        runtimeVariableSetter.addVariable('disableBtf', true);

        let adProduct = 'uap';

        if (this.isVideoEnabled(params)) {
            adProduct = 'vuap';
        }

        params.adProduct = params.adProduct || adProduct;

        setIds(params.lineItemId || params.uap, params.creativeId);
        // disableSlots(slotsToDisable);
        // enableSlots(slotsToEnable);

        // @TODO: unblock other slots - right now no other slots are loading,
        communicationServiceSlim.emit(AD_ENGINE_UAP_UNLOCK, {
            slotName: 'top_boxad'
        });

        setType(params.adProduct);

        if (params.slotName) {
            initSlot(params);
        }
    },
    // isFanTakeoverLoaded,
    getType,
    getUapId,
    isVideoEnabled(params): boolean {
        return params.thumbnail;
    },
    reset,
};

export function registerUap(): void {
    // communicationServiceSlim.on(
    //     AD_ENGINE_SLOT_EVENT,
    //     // communicationServiceSlim.getGlobalAction(AD_ENGINE_SLOT_EVENT),
    //     (action: AdSlotEventPayload) => {
    //         const isFirstCallAdSlot = action.adSlotName === 'top_leaderboard'
    //
    //         const isFirstCall =
    //             isFirstCallAdSlot &&
    //             [
    //                 AdSlotEvent.TEMPLATES_LOADED,
    //                 AdSlotStatus.STATUS_COLLAPSE,
    //                 AdSlotStatus.STATUS_FORCED_COLLAPSE,
    //             ]
    //                 .map((status) => action.event === status)
    //                 .some((x) => !!x);
    //
    //         if (isFirstCall) {
    //             communicationServiceSlim.emit(AD_ENGINE_UAP_LOAD_STATUS, {
    //                 isLoaded: universalAdPackage.isFanTakeoverLoaded(),
    //                 adProduct: universalAdPackage.getType(),
    //             });
    //         }
    //     }
    // );
    context.set('isUAP', 1);
}

