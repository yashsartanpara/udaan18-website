(function() {
  var o = document.createElement('div'), s = o.style;
  o.innerHTML = 'Loading...';
  s.position = 'fixed';
  s.width = s.height = '100%';
  s.top = s.left = '0';
  s.backgroundColor = '#111';
  s.display = 'flex';
  s.flexDirection = 'row';
  s.justifyContent = s.alignItems = 'center';
  s.color = '#fff';
  s.zIndex = 65536;
  s.fontSize = '4vh';
  document.body.appendChild(o);
  window.addEventListener('load', function el() {
    o.parentNode.removeChild(o);
    window.removeEventListener('load', el);
  });
})();
