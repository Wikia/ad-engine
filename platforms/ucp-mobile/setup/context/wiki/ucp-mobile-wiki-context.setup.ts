import { WikiContextSetup } from '@platforms/shared';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpMobileWikiContextSetup extends WikiContextSetup {
	execute(): void {
		super.execute();
	}
}
