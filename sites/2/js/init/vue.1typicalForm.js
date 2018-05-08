$('.typical-form').each(function(i, form) {
  new Vue({
    el: form,
    data: {
      isValidating: false,
      userInfo: [],
      errors: {
        name: null,
        phone: null,
        email: null,
        text: null
      },
      userFiles: [],
      currentInput: 0
    },
    methods: {
      keyup: function(e) {
        e.preventDefault();
      },
      toNextStep: function(input) {
        var data;
        if (input.closest('.form-group').next('.form-group').length > 0) {
          input.closest('.form-group').next('.form-group').find('.input').focus();
        } else {
          form = input.closest('.typical-form');
          data = {
            files: this.$data.userFiles
          };
          form.find('.input').each(function(i, inp) {
            data[$(inp).attr('name')] = $(inp).val().trim();
          });
          if (window[form.data('submit-callback')]) {
            window[form.data('submit-callback')](data, form);
            this.resetForm();
          }
        }
      },
      textaeraKeyup: function(event) {
        var height, input, val;
        input = $(event.target);
        val = input.val();
        input.next('.pre').html(val !== '' ? val.replace(/\n/gim, '<br>') + '<br>' : '<br>');
        height = input.next('.pre').outerHeight();
        input.css('height', Math.min(height, 300) + 'px');
      },
      setCurrentInput: function(event) {
        event.preventDefault();
        this.$data.currentInput = $(event.target).closest('.form-group').index();
      },
      checkStep: function(event) {
        var $this;
        if (!(event instanceof MouseEvent)) {
          if (event.keyCode !== 13) {
            return;
          }
        }
        event.preventDefault();
        $this = this;
        this.$data.isValidating = true;
        $(event.target).closest('.typical-form').find('.form-group').each(function(i, _formGroup) {
          var alert, errors, formGroup, input, progressBar, validation, value;
          formGroup = $(_formGroup);
          progressBar = formGroup.find('.progress')[0].progressBar;
          if (progressBar.isPlaying) {
            return;
          }
          input = formGroup.find('.input');
          alert = formGroup.find('.alert');
          value = input.val().trim();
          validation = Validator(input);
          errors = $this.$data.errors;
          formGroup.find('.progress').addClass('active');
          progressBar.end = function() {
            return setTimeout(function() {
              errors[input.data('validate')] = validation;
              if (errors[input.data('validate')]) {
                alert.html(errors[input.data('validate')]);
              }
              formGroup.find('.progress').removeClass('active');
              if (!errors[input.data('validate')]) {
                $this.toNextStep(input);
              }
              $this.$data.isValidating = false;
            }, 200);
          };
          progressBar.start();
        });
      },
      parseFiles: function(event) {
        var file, files, j, len, ref;
        files = this.$data.userFiles;
        files.splice(0, files.length);
        ref = event.target.files;
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          file = ref[i];
          if (i < 2) {
            files.push(file);
          }
        }
        setTimeout(function() {
          return checkUserFilesWidth();
        }, 10);
      },
      removeFile: function(index) {
        this.$data.userFiles.splice(index, 1);
        setTimeout(function() {
          return checkUserFilesWidth();
        }, 10);
      },
      resetForm: function() {
        var j, k, ref, ref1;
        this.$data.isValidating = false;
        this.$data.errors.name = null;
        this.$data.errors.phone = null;
        this.$data.errors.email = null;
        this.$data.errors.text = null;
        this.$data.currentInput = 0;
        $(form).find('.input:not([type="hidden"])').each(function(i, input) {
          $(input).blur().val('');
        });
        $(form).find('input[type="radio"], input[type="checkbox"]').each(function(i, input) {
          $(input).prop('checked', false);
        });
        for (i = j = 0, ref = this.$data.userFiles.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          this.$data.userFiles.splice(0, 1);
        }
        for (i = k = 0, ref1 = this.$data.userInfo.length; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
          this.$data.userInfo.splice(0, 1);
        }
      }
    }
  });
});
