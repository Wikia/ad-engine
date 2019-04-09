import { Dictionary } from '../models';

export interface VideoData {
	ad_error_code?: number;
	ad_product: string;
	audio?: 0 | 1;
	content_type?: string;
	creative_id: string;
	ctp?: 0 | 1;
	event_name: string;
	line_item_id: string;
	player: string;
	position: string;
	user_block_autoplay?: -1 | 0 | 1;
	video_id?: string;
}

export interface VideoEventData extends VideoData {
	audio: 0 | 1;
	browser: string;
	content_type: string;
	country: string;
	ctp: 0 | 1;
	document_visibility: string;
	position: string;
	price: '';
	pv_number: number;
	skin: string;
	timestamp: number;
	tz_offset: number;
	video_id: string;
	wsi: string;
}

export interface VideoEventListener {
	isEnabled?: () => boolean;

	onEvent(eventName: string, params: Dictionary, data: VideoData): void;
}

export {}; // tslint no-sole-types fix
