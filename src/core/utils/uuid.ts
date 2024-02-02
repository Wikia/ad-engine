import { v4 } from 'uuid';

// used in unit tests due to lack of crypto.getRandomValues API in mocha
const random = [227, 211, 169, 108, 244, 201, 229, 78, 172, 217, 229, 169, 119, 147, 154, 111];

class Uuid {
	v4(): string {
		try {
			return v4();
		} catch (e) {
			return v4({
				random,
			});
		}
	}
}

export const uuid = new Uuid();
