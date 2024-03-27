import { VideoData, VideoEventData } from "../../../../../../../core/listeners/listeners";
import { VIDEO_EVENT, VIDEO_PLAYER_TRACKING } from "../../../../../../../communication/events/events-video";
import { client } from "../../../../../../../core/utils";
import { communicationServiceSlim } from "../../../../utils/communication-service-slim";
import { context } from '../../../../../../../core/services/context-service';

export class VideoEventProvider {
    static getEventData(videoData: VideoData): VideoEventData {
        const now: Date = new Date();

        return {
            ad_error_code: videoData.ad_error_code,
            ad_product: videoData.ad_product,
            audio: videoData.audio ? 1 : 0,
            browser: `${client.getOperatingSystem()} ${client.getBrowser()}`,
            content_type: videoData.content_type || '',
            country: context.get('geo.country') || '',
            creative_id: videoData.creative_id || '',
            ctp: videoData.ctp ? 1 : 0,
            event_name: videoData.event_name,
            line_item_id: videoData.line_item_id || '',
            player: videoData.player,
            position: videoData.position || '',
            pv_number: context.get('wiki.pvNumber'),
            // rv: targetingService.get('rv', videoData.position) || '', // @TODO: fixit!
            rv: '1',
            skin: context.get('app.skin') || '',
            timestamp: now.getTime(),
            tz_offset: now.getTimezoneOffset(),
            user_block_autoplay: videoData.user_block_autoplay,
            video_id: videoData.video_id || '',
            video_number: videoData.video_number || '',
        };
    }

    static emit(eventInfo: VideoEventData): void {
        if (!eventInfo.ad_product || !eventInfo.player || !eventInfo.event_name) {
            return;
        }

        communicationServiceSlim.emit(VIDEO_PLAYER_TRACKING, { eventInfo });
    }

    static emitVideoEvent(videoEvent): void {
        communicationServiceSlim.emit(VIDEO_EVENT, { videoEvent });
    }
}
