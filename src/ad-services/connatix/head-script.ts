/* eslint-disable */
// CONNATIX CODE START
// @ts-ignore This is external code from a partner (Connatix)
export function initConnatixHeadScript(cid) {
	!(function (n) {
		if (!window.cnx) {
			(window.cnx = {}), (window.cnx.cmd = []);
			var t = n.createElement('iframe');
			t.src = 'javascript:false';
			(t.display = 'none'),
				(t.onload = function () {
					var n = t.contentWindow.document,
						c = n.createElement('script');
					(c.src = `//cd.connatix.com/connatix.player.js?cid=${cid}`),
						c.setAttribute('async', '1'),
						c.setAttribute('type', 'text/javascript'),
						n.body.appendChild(c);
				}),
				n.head.appendChild(t);
		}
	})(document);
}
// CONNATIX CODE END
