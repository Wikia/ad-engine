export function getYahooSspContext(isDesktop: boolean): object {
	const desktopSlots = {};

	const mobileSlots = {};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
