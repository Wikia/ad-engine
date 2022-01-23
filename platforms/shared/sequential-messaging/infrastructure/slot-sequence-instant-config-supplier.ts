import {
	InstantConfigServiceInterface,
	SequentialMessageConfig,
	SlotSequenceSupplier,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
// tslint:disable-next-line:no-blacklisted-paths
import { InstantConfigValue } from "../../../../src/ad-services/instant-config/instant-config.models";

@Injectable()
export class SlotSequenceInstantConfigSupplier implements SlotSequenceSupplier {
	private config: Map<string, SequentialMessageConfig>;

	constructor(instantConfig: InstantConfigServiceInterface) {
		this.config = this.readConfig(instantConfig);
	}

	get(lineItemId: any): SequentialMessageConfig {
		return this.config.get(lineItemId as string);
	}

	private readConfig(
		instantConfig: InstantConfigServiceInterface,
	): Map<string, SequentialMessageConfig> {
		const sequentialLineItemIds = this.validateSequentialMessagingConfigInput(
			instantConfig.get('icSequentialMessaging'),
		);
		if (!sequentialLineItemIds) {
			return null;
		}
		const result = new Map<string, SequentialMessageConfig>();

		sequentialLineItemIds.forEach((lineItemId: string) => {
			// TODO - this needs to be read from ICBM, please rework configuration structure
			result.set(lineItemId, {
				sequenceMessageId: lineItemId,
				length: 10,
				capFromStart: 0,
				capFromLastView: 0,
			});
		});
		return result;
	}

	private validateSequentialMessagingConfigInput(
		icSequentialMessaging: InstantConfigValue,
	): string[] {
		if (
			typeof icSequentialMessaging !== 'object' ||
			icSequentialMessaging instanceof Array ||
			Object.keys(icSequentialMessaging).length === 0
		) {
			return undefined;
		}

		for (const val of Object.values(icSequentialMessaging)) {
			if (typeof val !== 'object') return undefined;
			if (!('length' in val)) return undefined;
			if (typeof val.length !== 'string' && typeof val.length !== 'number') return undefined;
		}

		return icSequentialMessaging as string[];
	}
}
