exports._i = function(id, c) {
  var bid = "bss_" + id,
    d = document;
  if (d.getElementById(bid)) return;
  var dd = d.createElement("style");
  dd.setAttribute("id", bid);
  dd.appendChild(d.createTextNode(c));
  d.head.appendChild(dd);
};

exports._os = function(state) {
  var k,
    cls = "";
  for (k in state) {
    if (state[k]) {
      cls && (cls += " ");
      cls += k;
    }
  }
  return cls;
};
