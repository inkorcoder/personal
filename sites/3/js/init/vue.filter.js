var filter;

filter = new Vue({
  el: '#filter',
  data: {
    tyres: {
      width: 10,
      height: 10,
      radius: 17,
      isSummer: false,
      isWinter: false,
      author: ''
    },
    wheels: {
      width: 13,
      diameter: 12,
      et: 45,
      pcd: 23,
      dia: 20,
      author: ''
    },
    author: {
      name: '',
      model: '',
      year: 1992,
      modification: ''
    },
    currentHash: ''
  },
  methods: {
    setTyres: function(type, val) {},
    setLocalHash: function(hash) {
      this.$data.currentHash = hash;
    }
  }
});

$('#filter select').on('change', function() {
  var model;
  model = $(this).data('model').split('.');
  filter[model[0]][model[1]] = $(this).val();
});
