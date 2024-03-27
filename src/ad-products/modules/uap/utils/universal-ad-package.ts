// @ts-strict-ignore
import { context } from "../../../../core/services/context-service";
import { runtimeVariableSetter } from "../../../../core/wrappers/global-variable-setter";
import { client } from "../../../../core/utils/client";
import * as constants from "../../../../ad-products/templates/uap/constants";
import { targetingService } from "../../../../core/services/targeting-service";
import { communicationServiceSlim } from "./communication-service-slim";
import { AD_ENGINE_UAP_DISABLE, AD_ENGINE_UAP_UNLOCK } from "../../../../communication/events/events-ad-engine-uap";

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

function enableSlots(slotsToEnable: string[] = []) {
    slotsToEnable.forEach(slotToEnable => {
        communicationServiceSlim.emit(AD_ENGINE_UAP_UNLOCK, {
            slotName: slotToEnable
        });
    });
}
function disableSlots(slotsToDisable: string[] = []) {
    slotsToDisable.forEach(slotToDisable => {
        communicationServiceSlim.emit(AD_ENGINE_UAP_DISABLE, {
            slotName: slotToDisable
        });
    });
}

export const universalAdPackage = {
    ...constants,
    init(params: UapParams, slotsToEnable: string[] = [], slotsToDisable: string[] = []): void {
        runtimeVariableSetter.addVariable('disableBtf', true);

        let adProduct = 'uap';

        if (this.isVideoEnabled(params)) {
            adProduct = 'vuap';
        }

        params.adProduct = params.adProduct || adProduct;

        setIds(params.lineItemId || params.uap, params.creativeId);

        // @TODO: unblock other slots - right now no other slots are loading
        enableSlots(slotsToEnable);
        disableSlots(slotsToDisable);

        setType(params.adProduct);

        if (params.slotName) {
            initSlot(params);
        }
    },
    getType,
    getUapId,
    isVideoEnabled(params): boolean {
        return params.thumbnail;
    },
    reset,
};

export function registerUap(): void {
    context.set('uap.isUAP', 1);
}

