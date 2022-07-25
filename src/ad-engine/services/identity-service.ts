import {context} from ".";
import { communicationService, eventsRepository } from '@ad-engine/communication';

export class IdentityService {
    private static _identityService: IdentityService;

    private constructor() {
        this.setupPPID();
    }

    public static getInstance(): IdentityService {
        if (!IdentityService._identityService) {
            IdentityService._identityService = new IdentityService();
        }

        return IdentityService._identityService;
    }

    checkSilverSurferAvailability() {
        return window.SilverSurferSDK?.isInitialized() && window.SilverSurferSDK?.requestUserPPID;
    }

    setPPID(ppid: string) {
        const tag = window.googletag.pubads();
        tag.setPublisherProvidedId(ppid);
        context.set('targeting.ppid', ppid);
    }

    setupPPID(): void {
        if (this.checkSilverSurferAvailability() && context.get('services.ppid.enabled')) {
            window.SilverSurferSDK.requestUserPPID();

            communicationService.on(eventsRepository.IDENTITY_RESOLUTION_PPID_UPDATED, ({ppid}) => {
                this.setPPID(ppid);
                console.debug('DJ: PPID Process Ended')
                console.timeEnd('DJ: PPID Process')
            });
        }
    }
}