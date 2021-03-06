var GlobalUtils;

GlobalUtils = {
  createTriggerObject: function(array, value, itemName) {
    var i, item, key, len, result;
    result = {};
    for (i = 0, len = array.length; i < len; i++) {
      item = array[i];
      key = itemName ? item[itemName] : item;
      result[key] = value;
    }
    return result;
  },
  toggleTriggerObject: function(array, object, value, itemName) {
    var i, item, key, len, results;
    results = [];
    for (i = 0, len = array.length; i < len; i++) {
      item = array[i];
      key = itemName ? item[itemName] : item;
      results.push(object[key] = value);
    }
    return results;
  },
  rgbToHex: function(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },
  hexToRgb: function(hex) {
    var result, shorthandRegex;
    shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
    result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      };
    } else {
      return null;
    }
  },
  setRendererSize: function() {
    var containerHeight, containerWidth;
    containerWidth = window.innerWidth;
    containerHeight = window.innerHeight;
    renderer.setSize(containerWidth, containerHeight);
    camera.aspect = containerWidth / containerHeight;
    camera.updateProjectionMatrix();
  },
  closest: function(el, selector) {
    var matchesSelector;
    matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
      if (matchesSelector.call(el, selector)) {
        break;
      }
    }
    el = el.parentElement;
    return el;
  },
  random: function(min, max) {
    return min + Math.random() * (max - min);
  }
};
