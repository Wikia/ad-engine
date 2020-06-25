import { babDetection } from '@ad-engine/core';

const popupIdentifier = 'bab-remover';

class BabRemover {
	constructor() {
		if (window.location.host !== 'fandom.com') {
			this.install();
		}
	}

	async install(): Promise<void> {
		const isBabDetected = await babDetection.run();

		if (isBabDetected) {
			this.showPopup();
		}
	}

	showPopup(): void {
		const body: HTMLElement = document.querySelector('body');
		const popup: HTMLElement = document.createElement('div');

		popup.id = popupIdentifier;
		popup.innerHTML =
			'<div class="popup">' +
			'<div class="image">' +
			'<img src="https://avatars2.githubusercontent.com/u/1171011?s=200&v=4" class="logo" alt="" />' +
			'<img src="https://mhlps.files.wordpress.com/2013/01/chat_potte4.png" alt="" />' +
			'</div>' +
			'<p class="title">We love what we do.</p>' +
			'<p class="warning">Please appreciate it and if you use AdBlock, disable it.</p>' +
			// tslint:disable-next-line:prefer-template
			'<button id="exceptionButton">Yes, I want to browse ' +
			(window.wgMainPageTitle ? window.wgMainPageTitle : window.location.host) +
			'<br />and add FANDOM to AdBlock exceptions</button>' +
			'<a class="show" id="showButton" href="#">Show me that ads are not so bad</a> ' +
			'<a class="next" id="nextButton" href="#">Next time - I promise!</a> ' +
			'<a class="back" href="http://fandom.com">Go back to FANDOM.com</a> ' +
			'</div>';

		body.append(popup);

		body.classList.add('shadowed');
		body.childNodes.forEach((node: HTMLElement) => {
			if (node && node.classList && node.id !== popupIdentifier) {
				node.classList.add('node-blurred');
			}
		});

		const exceptionButton: HTMLElement = document.getElementById('exceptionButton');
		exceptionButton.onclick = () => {
			window.open('abp:subscribe?location=https://std.wpcdn.pl/wpjslib/wp-whitelist.txt');
		};

		const showButton: HTMLElement = document.getElementById('showButton');
		showButton.onclick = (e) => {
			e.preventDefault();
			this.markPlacements();
			this.hidePopup();
		};

		const nextButton: HTMLElement = document.getElementById('nextButton');
		nextButton.onclick = (e) => {
			e.preventDefault();
			this.hidePopup();
		};
	}

	hidePopup(): void {
		const body: HTMLElement = document.querySelector('body');
		const popup: HTMLElement = document.getElementById(popupIdentifier);

		body.classList.remove('shadowed');
		body.childNodes.forEach((node: HTMLElement) => {
			if (node && node.classList && node.id !== popupIdentifier) {
				node.classList.remove('node-blurred');
			}
		});
		popup.classList.add('hidden');
	}

	markPlacements() {
		const tlbAd: HTMLElement = document.getElementById('top_leaderboard');
		const tbAd: HTMLElement = document.getElementById('top_boxad');
		const icbAd: HTMLElement = document.getElementById('incontent_boxad');
		const blbAd: HTMLElement = document.getElementById('bottom_leaderboard');

		const tlb: HTMLElement = document.createElement('div');
		const tb: HTMLElement = document.createElement('div');
		const icb: HTMLElement = document.createElement('div');
		const blb: HTMLElement = document.createElement('div');

		tlb.classList.add('remover-placement', 'remover-tlb');
		tb.classList.add('remover-placement', 'remover-tb');
		icb.classList.add('remover-placement', 'remover-icb');
		blb.classList.add('remover-placement', 'remover-blb');

		tlb.innerHTML =
			'We value your comfort of browsing our site. That is why we try to make ads not too invasive for you. We call this placement Top Leaderboard or TLB. Sometimes it is bigger, sometimes it is not there at all. You will always find it below navbar.';
		tb.innerHTML =
			'This ad here is Top Boxad. It is high on the right and it is not too big, right? If it is here it is colorful and easy to avoid - we will not cover any page content.';
		icb.innerHTML =
			'This one is Incontent Boxad. Here we place content that you may be interested in, for example promotions, premieres or recommended items that you have recently viewed. The advertisement follows you for a short moment, so that you do not accidentally overlook what we have prepared for you.';
		blb.innerHTML =
			'And this is the Bottom Leaderboard. It is big, but it is at the very bottom of the page, so it will not distract you too often. However, it is sometimes worth taking a look at it, because we collect here interesting offers, and sometimes even short and interesting videos. This is also the last advertisement on this page. Is it true that there are not too many of them?';

		tlbAd.parentNode.insertBefore(tlb, tlbAd);
		tbAd.parentNode.insertBefore(tb, tbAd);
		icbAd.parentNode.insertBefore(icb, icbAd);
		blbAd.parentNode.insertBefore(blb, blbAd);
	}
}

export const babRemover = new BabRemover();
