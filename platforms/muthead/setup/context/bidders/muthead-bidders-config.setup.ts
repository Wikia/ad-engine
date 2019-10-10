import { BiddersConfigSetup } from '@platforms/shared';
import { setA9AdapterConfig } from '@platforms/shared-sports';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MutheadBiddersConfigSetup implements BiddersConfigSetup {
	setBiddersConfigContext(): void {
		setA9AdapterConfig();
	}
}
