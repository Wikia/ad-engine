import {BaseServiceSetup, communicationService, context, eventsRepository, utils} from "@wikia/ad-engine";
import {iasVideoTracker} from "../../../ad-products/video/porvata/plugins/ias/ias-video-tracker";
import {Injectable} from "@wikia/dependency-injection";

const logGroup = 'player-setup';

@Injectable()
export class VideoPlayerSetup extends BaseServiceSetup {

    async execute(): Promise<void> {
        communicationService.on(eventsRepository.VIDEO_PLAYER_RENDERED, () => {
            this.loadIasTrackerIfEnabled();
        })
    }

    private loadIasTrackerIfEnabled(): void {
        if (context.get('options.video.iasTracking.enabled')) {
            utils.logger(logGroup, 'Loading IAS tracker for video player')
            iasVideoTracker.load();
        }
    }
}
