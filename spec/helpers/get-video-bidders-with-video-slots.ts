export function getVideoBiddersWithVideoSlots(biddersConfig) {
	return Object.keys(biddersConfig).filter(
		(configKey) =>
			biddersConfig[configKey]?.slots?.featured ||
			biddersConfig[configKey]?.slots?.incontent_player,
	);
}
