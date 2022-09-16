import { v4 } from 'uuid';

class Uuid {
	v4(): string {
		return v4();
	}
}

export const uuid = new Uuid();
