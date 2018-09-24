class AdSlots {
	constructor() {
		this.topLeaderboard = '#top_leaderboard';
		this.bottomLeaderboard = '#bottom_leaderboard';
		this.topBoxad = '#top_boxad';
		this.incontentBoxad = '#incontent_boxad';
		this.repeatableBoxad = '#repeatable_boxad_';
		this.leaderboardWidth = 728; // shared between leaderboards
		this.leaderboardHeight = 90; // shared between leaderboards
		this.adProductsTopLeaderboardWidth = 1200; // UAP and ABCD leaderboards have the same width
		this.uapTopLeaderboardHeight = 300;
		this.uapBottomLeaderboardWidth = 1024;
		this.uapBottomLeaderboardHeight = 102;
		this.abcdLeaderboardHeight = 240;
		this.boxadWidth = 300; // shared between boxads
		this.boxadHeight = 250; // shared between boxads
		this.lineItemParam = 'data-gpt-line-item-id';
	}
}

export default new AdSlots();
