import { SequentialMessagingCookie } from '../data-structures/sequential-messaging-cookie';

export interface CookieJarInterface {
	set(name: string, value: SequentialMessagingCookie): void;
}
