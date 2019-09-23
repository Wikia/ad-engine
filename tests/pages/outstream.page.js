class Outstream {
	constructor() {
		this.pageLink = 'templates/outstream/';
		this.player = '.porvata-outstream';
		this.videoPlayer = '.video-player';
		this.floatingPlayer = '.outstream-floating';
		this.callForPlayer = 'ads?gdfp';
		this.porvataSlot = 'incontent_player';
		this.playerWidth = 300;
		this.playerHeight = 250;
		this.closePlayerButton = '#player-close';
		this.videoDuration = 45000;
		this.pageLength = 3800;
	}
}

export const outstream = new Outstream();
