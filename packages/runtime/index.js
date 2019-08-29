exports._i = function(id, c) {
  var bid = "bss_" + id,
    d = document;
  if (d.getElementById(bid)) return;
  var s = d.createElement("style");
  s.setAttribute("id", bid);
  s.appendChild(d.createTextNode(c));
  d.head.appendChild(s);
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
