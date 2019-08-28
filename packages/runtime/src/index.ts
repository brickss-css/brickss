export function injectCss(css: string, id: string) {
  const brickId = `brickss_${id}`;
  if (document.getElementById(brickId)) {
    return;
  }

  const s = document.createElement("style");
  s.setAttribute("id", brickId);
  s.appendChild(document.createTextNode(css));
  document.head.appendChild(s);
}

export function objStr(state: any): string {
  var k, cls='';
	for (k in state) {
		if (state[k]) {
			cls && (cls += ' ');
			cls += k;
		}
	}
	return cls;
}

export function setTheme() {}
