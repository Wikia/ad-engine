import { SlotTargeting } from "../../../../../core/services/targeting-service";
import { Dictionary } from "../../../../../core/models/dictionary";

export function parseTargetingParams(targetingParams: Dictionary): SlotTargeting {
    const result: Dictionary = {};

    Object.keys(targetingParams).forEach((key) => {
        let value = targetingParams[key];

        if (typeof value === 'function') {
            value = value();
        }

        if (value !== null) {
            result[key] = value;
        }
    });

    return result as SlotTargeting;
}
