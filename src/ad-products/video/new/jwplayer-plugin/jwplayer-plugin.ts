import { JWPlayer } from './jwplayer';
import { JWPlayerConfig } from './jwplayer-config';

export class JWPlayerAdEnginePlugin {
	// @ts-ignore
	constructor(private player: JWPlayer, private config: JWPlayerConfig, private div: HTMLElement) {
		this.run();
	}

	private run(): void {}
}
