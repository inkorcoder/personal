var bytesToSize, checkUserFilesWidth, messagePopup;

bytesToSize = function(bytes) {
  var i, sizes;
  sizes = ['б', 'кб', 'Mб', 'Гб', 'Tб'];
  if (bytes === 0) {
    return 0;
  }
  i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

messagePopup = new Vue({
  el: '#messagePopup',
  data: {
    userCurrentStep: 0,
    userSteps: $('#messagePopup .user-form .step'),
    userStepsCount: $('#messagePopup .user-form .step').length,
    userInfo: [],
    isOpened: false,
    isActive: false,
    isValidating: false,
    userFiles: [],
    errors: {
      name: false,
      email: false,
      text: false
    }
  },
  methods: {
    keyup: function(e) {
      if (this.$data.isValidating) {
        e.preventDefault();
      }
    },
    checkStep: function(event) {
      var $this, alert, errors, input, oldStep, progressBar, validation, value;
      if (this.$data.isValidating) {
        return;
      }
      if (!(event instanceof MouseEvent)) {
        if (event.keyCode !== 13) {
          return;
        }
      }
      oldStep = this.$data.userSteps.eq(this.$data.userCurrentStep);
      progressBar = oldStep.find('.progress')[0].progressBar;
      if (progressBar.isPlaying) {
        return;
      }
      input = oldStep.find('.input');
      alert = oldStep.find('.alert');
      value = input.val().trim();
      validation = Validator(input);
      errors = this.$data.errors;
      oldStep.find('.progress').addClass('active');
      if (value.length === 0 && !input.attr('required')) {
        this.toNextStep();
        this.$data.isValidating = false;
      }
      $this = this;
      this.$data.isValidating = true;
      progressBar.end = function() {
        errors[input.data('validate')] = validation;
        if (errors[input.data('validate')]) {
          alert.html(errors[input.data('validate')]);
        }
        oldStep.find('.progress').removeClass('active');
        if (!errors[input.data('validate')]) {
          $this.toNextStep();
        }
        $this.$data.isValidating = false;
      };
      progressBar.start();
    },
    toNextStep: function() {
      var formData, newStep, oldStep, value;
      oldStep = this.$data.userSteps.eq(this.$data.userCurrentStep);
      value = oldStep.find('input').val().trim();
      if (!this.$data.userInfo[this.$data.userCurrentStep]) {
        this.$data.userInfo.push(value);
      } else {
        this.$data.userInfo.splice(this.$data.userCurrentStep, 0, value);
        this.$data.userInfo.splice(this.$data.userCurrentStep + 1, 1);
      }
      this.$data.userCurrentStep++;
      newStep = this.$data.userSteps.eq(this.$data.userCurrentStep);
      newStep.find('input').focus();
      if (window[$('#callPopup').data('submit-callback')] && this.$data.userCurrentStep === this.$data.userStepsCount) {
        formData = {};
        oldStep.closest('form').find('input').each(function(i, inp) {
          if ($(inp).attr('type').match(/(radio|checkbox)/gim)) {
            formData[$(inp).attr('name')] = $(inp).prop('checked');
          } else {
            formData[$(inp).attr('name')] = $(inp).val().trim();
          }
        });
        formData.customFilesArray = this.$data.userFiles;
        window[$('#callPopup').data('submit-callback')](formData, oldStep.closest('form'));
        this.resetForm();
      }
    },
    setStep: function(index) {
      var newStep;
      this.$data.userCurrentStep = index;
      newStep = this.$data.userSteps.eq(this.$data.userCurrentStep);
      newStep.find('.input').focus();
    },
    closePopup: function() {
      var data;
      data = this.$data;
      data.isActive = false;
      uncutBody();
      setTimeout(function() {
        return data.isOpened = false;
      }, 301);
    },
    parseFiles: function(event) {
      var file, files, i, j, len, ref;
      files = this.$data.userFiles;
      files.splice(0, files.length);
      console.dir(event.target);
      ref = event.target.files;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        file = ref[i];
        if (i < 10) {
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
      var $this, form, i, j, k, ref, ref1;
      form = $('#messagePopup form')[0];
      this.$data.isValidating = false;
      this.$data.errors.name = null;
      this.$data.errors.phone = null;
      this.$data.errors.email = null;
      this.$data.errors.text = null;
      $this = this;
      setTimeout(function() {
        $this.closePopup();
        $this.$data.userCurrentStep = 0;
        $this.$data.isValidating = false;
        return $this.$data.isPhoneEntered = false;
      }, 5000);
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

(function() {
  var container;
  container = $('#messagePopup .scrolled-block').perfectScrollbar();
  $('#messagePopup .textarea-outer .input').on('keydown keypress keyup', function(e) {
    $(this).css('height', 'auto');
    $(this).css('height', $(this)[0].scrollHeight + 'px');
    if ($(this)[0].selectionEnd === $(this).val().length) {
      container[0].scrollTop = $(this)[0].scrollHeight;
    }
    container.perfectScrollbar('update');
  });
})();

checkUserFilesWidth = function() {
  var width;
  width = $('.users-files-list').outerWidth();
  $('.users-files-list > li').each(function(i, li) {
    if (($(li).outerWidth() * i) > width) {
      $(li).addClass('hidden');
    } else {
      $(li).removeClass('hidden');
    }
  });
};

$(window).resize(function() {
  checkUserFilesWidth();
});
