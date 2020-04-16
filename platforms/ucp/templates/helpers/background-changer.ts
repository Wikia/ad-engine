import { Injectable } from '@wikia/dependency-injection';

export interface BackgroundOptions {
	backgroundColor: string;
	backgroundMiddleColor: string;
	skinImage: string;
	skinImageHeight: number;
	ten64: boolean;
	skinImageWidth: number;
}

@Injectable({ autobind: false })
export class BackgroundChanger {
	change(options: BackgroundOptions): void {}
}
