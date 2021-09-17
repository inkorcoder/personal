var priceSection, sectionResult;

sectionResult = false;

if ($('#priceSection').data('sections')) {
  sectionResult = {};
  $('#priceSection').data('sections').split(',').forEach(function(item) {
    sectionResult[item] = 0;
  });
}

priceSection = new Vue({
  el: '#priceSection',
  data: {
    mess: 'dsfasdfasd',
    result: sectionResult || {
      live: 0,
      "public": 0,
      additionally: 0
    },
    currentRoute: window.location.hash
  },
  methods: {}
});

window.onhashchange = function() {
  priceSection.currentRoute = window.location.hash;
};
