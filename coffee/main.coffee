$ = (str, ctx)->
	arr = []
	if ctx
		if ctx.querySelectorAll(str)
			arr = [].slice.call ctx.querySelectorAll(str)
	else if document.querySelectorAll(str)
		arr = [].slice.call document.querySelectorAll(str)

	if arr.length > 0
		arr.click = (fn)->
			n.addEventListener('click', (e)-> fn e) for n in arr
		arr.addClass = (str)->
			n.classList.add(str) for n in arr
		arr.removeClass = (str)->
			n.classList.remove(str) for n in arr
		arr.src = ->
			for n in arr
				n.setAttribute('src', n.getAttribute('data-src'))
				n.onload = -> @classList.add 'showed'
		arr.each = (fn)->
			fn(i, n) for n, i in arr


	return arr

window.onload = ->

	$ '.block .string'
		.click (e)->
			if window.innerWidth > 992 then return
			if $('.explaining', e.target).length is 0 then return
			e.preventDefault()
			$('.popup .inner')[0].innerHTML = $('.explaining', e.target)[0].outerHTML
			$('html,body').addClass 'overlayed'
			$('.popup').addClass 'opened'
			setTimeout ->
				$('.popup .inner img').src()
			, 1
			return

	$ '.popup button'
		.click (e)->
			e.preventDefault()
			$('.popup').removeClass 'opened'
			$('html,body').removeClass 'overlayed'
			return

	setTimeout ->

		if window.innerWidth > 992
			$('img').src()
			$ '.work-dropdown'
				.each (i, dropdown)->
					indx = dropdown.parentNode.getAttribute('href')
					f = document.createElement 'figure'
					h = ''
					for j in [0...4]
						h += "<img data-src=\"img/"+(indx)+(j+1)+".jpg\">";
					f.innerHTML = h
					dropdown.insertBefore f, dropdown.firstChild
					$('img', dropdown).src()
					return

		return
	, 1000


	return
