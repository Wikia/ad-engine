import { SlotTargeting, targetingService } from "../../../../../../../core/services/targeting-service";
import { context } from "../../../../../../../core/services/context-service";
import { Dictionary } from "../../../../../../../core/models/dictionary";
import { communicationServiceSlim } from "../../../../utils/communication-service-slim";
import { AD_ENGINE_INVALIDATE_SLOT_TARGETING } from "../../../../../../../communication/events/events-ad-engine-slot";
import { parseTargetingParams } from "../../helpers/parsing-targeting-params";
import { isCoppaSubject } from "../../../../../../../core/utils/is-coppa-subject";
import { trackingOptIn } from "../../../../../../../core/services/tracking-opt-in";

export interface TaglessSlotOptions {
    correlator: number;
    targeting: SlotTargeting;
    adUnit: string;
    size: string;
}

export interface VastOptions {
    correlator: number;
    targeting: SlotTargeting;
    videoAdUnitId: string;
    contentSourceId: string;
    customParams: string;
    videoId: string;
    numberOfAds: number;
    vpos: string;
    isTagless: boolean;
    us_privacy: string;
    gdpr_consent: string;
}

const availableVideoPositions: string[] = ['preroll', 'midroll', 'postroll'];
const vastBaseUrl = 'https://pubads.g.doubleclick.net/gampad/ads?';

export function getCustomParameters(
    slotName: string,
    extraTargeting: Dictionary = {},
    encode = true,
): string {
    const targetingData = targetingService.dump() || {};
    const targeting = {};

    function setTargetingValue(
        key: string,
        value: string | string[] | (() => string | string[]),
    ): void {
        if (typeof value === 'function') {
            targeting[key] = value();
        } else if (value !== 'undefined' && value !== null) {
            targeting[key] = value;
        }
    }

    Object.keys(targetingData).forEach((key) => {
        setTargetingValue(key, targetingData[key]);
    });

    communicationServiceSlim.emit(AD_ENGINE_INVALIDATE_SLOT_TARGETING, { slotName });
    const slotTargeting = targetingService.dump<SlotTargeting>(slotName);
    const slotTargetingParsed = parseTargetingParams(slotTargeting);

    const params: Dictionary = {
        ...targeting,
        ...slotTargetingParsed,
        ...extraTargeting,
    };

    const paramsInString = Object.keys(params)
        .filter((key: string) => params[key])
        .map((key: string) => `${key}=${params[key]}`)
        .join('&');

    return encode ? encodeURIComponent(paramsInString) : paramsInString;
}

function generateCorrelator(): number {
    return Math.round(Math.random() * 10000000000);
}

export function buildVastUrl(
    aspectRatio: number,
    slotName: string,
    options: Partial<VastOptions> = {},
): string {
    const params: string[] = [
        'output=xml_vast4',
        'env=vp',
        'gdfp_req=1',
        'impl=s',
        'unviewed_position_start=1',
        `url=${encodeURIComponent(window.location.href)}`,
        `description_url=${encodeURIComponent(window.location.href)}`,
        `correlator=${generateCorrelator()}`,
    ];
    // const slot: AdSlot = slotService.get(slotName);
    const ppid = targetingService.get('ppid');
    const over18 = targetingService.get('over18');

    if (over18) {
        params.push(`over_18=${over18}`);
    }

    if (ppid) {
        params.push(`ppid=${ppid}`);
    }

    if (isCoppaSubject()) {
        params.push('tfcd=1');
    }

    params.push(`iu=${context.get(`slots.${slotName}.videoAdUnit`) || context.get('vast.adUnitId')}`);
    params.push(`sz=640x480`);
    params.push(`cust_params=${getCustomParameters(slotName, options.targeting)}`);

    if (options.contentSourceId && options.videoId) {
        params.push(`cmsid=${options.contentSourceId}`);
        params.push(`vid=${options.videoId}`);
    }

    if (options.vpos && availableVideoPositions.indexOf(options.vpos) > -1) {
        params.push(`vpos=${options.vpos}`);
    }

    if (options.numberOfAds !== undefined) {
        params.push(`pmad=${options.numberOfAds}`);
    }

    params.push(`rdp=${trackingOptIn.isOptOutSale() ? 1 : 0}`);
    params.push(`npa=${trackingOptIn.isOptedIn() ? 0 : 1}`);

    if (options.isTagless) {
        const consentRequired = context.get('options.geoRequiresConsent');
        const signalRequired = context.get('options.geoRequiresSignal');
        params.push('tagless=1');

        if (consentRequired) {
            params.push(`gdpr=1`);
        } else {
            params.push(`gdpr=0`);
        }

        if (consentRequired && options.gdpr_consent) {
            params.push(`gdpr_consent=${options.gdpr_consent}`);
        }

        if (signalRequired && options.us_privacy) {
            params.push(`us_privacy=${options.us_privacy}`);
        }
    }

    return vastBaseUrl + params.join('&');
}
