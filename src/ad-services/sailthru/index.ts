class Sailthru {
	isLoaded(): boolean {
		return !!window.Sailthru;
	}
}

export const sailthru = new Sailthru();
