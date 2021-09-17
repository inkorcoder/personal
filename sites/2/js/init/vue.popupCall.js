var callPopup;

Vue.directive("results-actived", {
  update: function() {
    var el;
    el = $(this.el);
    return setTimeout(function() {
      el.addClass('active');
    }, 10);
  }
});

callPopup = new Vue({
  el: '#callPopup',
  data: {
    userCurrentStep: 0,
    userSteps: $('#callPopup .user-form .step'),
    userStepsCount: $('#callPopup .user-form .step').length,
    userInfo: [],
    isOpened: false,
    isActive: false,
    isValidating: false,
    isPhoneEntered: false,
    errors: {
      name: false,
      phone: false,
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
    checkStep: function(even) {
      var $this, alert, errors, input, oldStep, progressBar, validation, value;
      if (!(even instanceof MouseEvent)) {
        if (even.keyCode !== 13) {
          return;
        }
      }
      oldStep = this.$data.userSteps.eq(this.$data.userCurrentStep);
      progressBar = oldStep.find('.progress')[0].progressBar;
      if (progressBar.isPlaying) {
        return;
      }
      input = oldStep.find('input');
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
        return setTimeout(function() {
          errors[input.data('validate')] = validation;
          if (errors[input.data('validate')]) {
            alert.html(errors[input.data('validate')]);
          }
          oldStep.find('.progress').removeClass('active');
          if (!errors[input.data('validate')]) {
            $this.toNextStep();
          }
          $this.$data.isValidating = false;
        }, 200);
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
        window[$('#callPopup').data('submit-callback')](formData, oldStep.closest('form'));
        this.resetForm();
      }
    },
    setStep: function(index) {
      var newStep;
      this.$data.userCurrentStep = index;
      newStep = this.$data.userSteps.eq(this.$data.userCurrentStep);
      newStep.find('input').focus();
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
    resetForm: function() {
      var $this, form, i, j, ref;
      form = $('#callPopup form')[0];
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
      for (i = j = 0, ref = this.$data.userInfo.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        this.$data.userInfo.splice(0, 1);
      }
    }
  }
});
