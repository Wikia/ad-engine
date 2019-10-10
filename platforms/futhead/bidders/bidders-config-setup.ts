import { BiddersConfigSetup } from '@platforms/shared';
import { setA9AdapterConfig } from '@platforms/shared-sports';
import { Injectable } from '@wikia/dependency-injection';
import { setPrebidAdaptersConfig } from './prebid';

@Injectable()
export class FutheadBiddersConfigSetup implements BiddersConfigSetup {
	setBiddersConfigContext(): void {
		setA9AdapterConfig();
		setPrebidAdaptersConfig();
	}
}
