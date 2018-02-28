(function() {
  var o = document.createElement('div'), s = o.style;
  s.position = 'fixed';
  s.width = s.height = '100%';
  s.top = s.left = '0';
  s.backgroundColor = '#111';
  s.display = 'flex';
  s.flexDirection = 'row';
  s.justifyContent = s.alignItems = 'center';
  s.zIndex = 65536;
  o.innerHTML = '<img src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAXcAAAAoCAYAAAAFb7poAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAE6SURBVHic7d1BDsIgFARQMd7/yniBLmgg8Dt9b2lM+q04IZkUW++9fwa01trI+8h2ar1Yp3DP9/QAAKwn3AECCXeAQMIdINDv9AAwQlEK99i5AwQS7gCBhDtAIOEOEKh8oTr6ZOKMmbLOfOvNzPzEe/W2mdnDzh0gkHAHCCTcAQIJd4BApQrVHce6Xl3j6rXRa+w42nZ0vlP3b7WZz7bDqfWX8v2yh507QCDhDhBIuAMEEu4AgUoVqk+kgAIqsnMHCCTcAQIJd4BAwh0gkEL1Bk8IctLoU6vV19CO39GMlPns3AECCXeAQMIdIJBwBwg0XKiuLmmuyohThdHM8b6VCq3q811ZPUv1Mmy1HUdO80x27gCBhDtAIOEOEEi4AwSKKJXgrU79py312bkDBBLuAIGEO0Ag4Q4Q6A+A56AzTpCr+QAAAABJRU5ErkJggg==" style="height: 4vh;"/>';
  document.body.appendChild(o);
  window.addEventListener('load', function el() {
    o.parentNode.removeChild(o);
    window.removeEventListener('load', el);
  });
})();
