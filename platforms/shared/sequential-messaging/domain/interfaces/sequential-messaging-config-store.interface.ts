import { SequentialMessagingConfig } from '../data-structures/sequential-messaging-config';

export interface SequentialMessagingConfigStoreInterface {
	get(): SequentialMessagingConfig;
}
