[].slice.call(document.querySelectorAll('input[type="text"]')).forEach(function(input){
	console.log(input);
	function inputFilter(value){
			return (/^\d*$/gim).test(value);
	}
	["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
		input.addEventListener(event, function() {
			console.log(inputFilter(this.value));
			if (inputFilter(this.value)) {
				this.oldValue = this.value;
				this.oldSelectionStart = this.selectionStart;
				this.oldSelectionEnd = this.selectionEnd;
			} else if (this.hasOwnProperty("oldValue")) {
				this.value = this.oldValue;
				this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
			}
		});
	});
});

