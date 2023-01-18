import { google as googleNamespace } from '@alugha/ima/lib/typings/ima';

declare global {
	namespace google {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		export import ima = googleNamespace.ima;
	}
}
