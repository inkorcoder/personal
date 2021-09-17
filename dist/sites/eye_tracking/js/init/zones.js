function Zone(){

	var markup = '<div class="zone">'+
		'<span class="point"></span>'+
			'<span class="point"></span>'+
			'<span class="point"></span>'+
			'<span class="point"></span>'+
			'<span class="name"></span>'+
		'</div>';

	this.pos = new Vector();
	this.size = new Vector();
	this.node = $(markup);
	this.node.data('zoneLink', this);

	this.name = "";

	this.id = Math.floor(Math.random()*1000000);

	this.getPosition = function(){
		return {
			top: (this.pos.y*100)+"%",
			left: (this.pos.x*100)+"%",
			height: (this.size.y*100)+"%",
			width: (this.size.x*100)+"%"
		}
	};

	this.remove = function(){
		for (var i = 0; i < zones.length; i++){
			if (zones[i].id === this.id){
				this.node.remove();
				zones.splice(i, 1);
				return;
			}
		}
	}

	this.getData = function(){
		return {
			position: this.pos.clone(),
			size: this.pos.clone(),
			id: this.id,
			name: this.name
		}
	}

}

var zones = zones || [];
var colors = [
	"255,59,48", 	"0,122,255", 	"76,217,100", "217,76,191",
	"76,179,217", "217,140,76", "217,93,76", 	"117,76,131",
	"98,76,217", 	"76,226,200", "104,117,76", "217,217,217"
];
var alpha = .5;

$(document).ready(function(){


	var activeZone;
	// var zone = new Zone('.zone');
	// zone.color = colors[0];


	var mouse = new Vector();
	var start = new Vector();
	var dragging = false;
	var draggingNew = false;

	var wrapper = $('.image-scaler .image');
	var bbox = wrapper[0].getBoundingClientRect();
	var w = bbox.width,
			h = bbox.height;
	var sides = false;
	var oldSize, oldPos;

	function draw(){
		requestAnimationFrame(draw);
		for (var i = 0; i < zones.length; i++){
			var z = zones[i];
			z.pos.clamp(new Vector(0,0), new Vector(1-z.size.x,1-z.size.y));
			z.node.css(z.getPosition());
			z.node.css({
				"background": "rgba("+z.color+","+alpha+")",
				"border-color": "rgba("+z.color+",.5)"
			});
			z.node.find('.name').text(z.name);
			if (activeZone && activeZone.id === z.id) {
				z.node.addClass('active');
			} else {
				z.node.removeClass('active');
			}
		}
		if (activeZone){
			$('#deleteActiveZone').removeClass('hidden');
		} else {
			$('#deleteActiveZone').addClass('hidden');
		}
	}
	draw();


	$('#opacityRange').on('input change blur', function(){
		alpha = parseInt($(this).val()) / 100;
	});

	$(window).resize(function(){
		bbox = wrapper[0].getBoundingClientRect();
		w = bbox.width;
		h = bbox.height;
	});

	function getSides(e){
		if (!$(e.target).closest('.point').length) return false;
		var index = $(e.target).closest('.point').index();
		return {
			top: index === 0 || index === 1,
			right: index === 1 || index === 2,
			bottom: index === 2 || index === 3,
			left: index === 3 || index === 0
		}
	}

	function renderZonesList(){
		var list = $('#zonesList');
		var html = "";
		for (var i = 0; i < zones.length; i++){
			var z = zones[i];
			if (!z.name) z.name = "Зона "+(i+1);
			html += '<tr>'+
				'<td>'+
					'<input type="text" class="input transparent" value="'+z.name+'">'+
				'</td>'+
				'<td class="align-right" style="width:40px">'+
					'<button class="btn block" data-remove><i class="material-icons" style="color:rgb('+z.color+')">border_inner</i></button>'+
				'</td>'+
			'</tr>';
		}
		$('#zonesList').html(html);
	}

	if (wrapper.data('static-zones')) return;

	wrapper.on('mousedown', '.zone', function(e){
		if ($(e.target).closest('.point').length) return;
		activeZone = $(this).data('zoneLink');
		sides = false;
		start.x = e.pageX - bbox.left;
		start.y = e.pageY - bbox.top;
		start = start.clone().subtract(activeZone.pos.clone().scale(w, h));
		dragging = true;
	});

	$('#zonesList').on('input change', 'tr .input', function(){
		var index = $(this).closest('tr').index(),
				value = $(this).val().trim();
		zones[index].name = value;
	});

	$('#zonesList').on('click', '[data-remove]', function(){
		var index = $(this).closest('tr').index();
		if (activeZone && zones[index].id === activeZone.id){
			activeZone = null;
		}
		zones[index].remove();
		renderZonesList();
	});

	$('#deleteActiveZone').on('click', '.action', function(){
		activeZone.remove();
		activeZone = null;
		renderZonesList();
	});

	$(document).on('mousemove', function(e){
		mouse.x = e.pageX - bbox.left;
		mouse.y = e.pageY - bbox.top;
		var current = mouse.subtract(start.clone());

		if (draggingNew){
			// var size = current.clone().subtract(start);
			current = mouse.clone();
			// current.add(start);
			var min = Vector.min(start, current).scale(1/w, 1/h);
			var max = Vector.max(start, current).scale(1/w, 1/h);
			min.clamp(new Vector(), new Vector(1,1));
			max.clamp(new Vector(), new Vector(1,1));
			activeZone.pos = min;
			activeZone.size = max.clone().subtract(min.clone());
			// console.log(current.distanceTo(start));
			return;
		}

		if (!dragging) return;
		// console.log(sides);
		if (sides){
			current = mouse.clone().subtract(oldPos.clone().scale(w, h)).subtract(start.clone());
			if (sides.right && sides.bottom){
				current = mouse.clone().subtract(activeZone.pos.clone().scale(w, h)).subtract(start.clone());
				activeZone.size.x = clamp(oldSize.x + (current.x / w), .05, 1);
				activeZone.size.y = clamp(oldSize.y + (current.y / h), .05, 1);
			} else if (sides.right && sides.top){
				activeZone.size.x = clamp(oldSize.x + (current.x / w), .05, 1);
				activeZone.size.y = clamp(oldSize.y - (current.y / h), .05, 1);
				activeZone.pos.y = oldPos.y + (oldSize.y - activeZone.size.y);
			} else if (sides.left && sides.bottom){
				activeZone.size.x = clamp(oldSize.x - (current.x / w), .05, 1);
				activeZone.size.y = clamp(oldSize.y + (current.y / h), .05, 1);
				activeZone.pos.x = oldPos.x + (oldSize.x - activeZone.size.x);
			} else if (sides.left && sides.top){
				activeZone.size.x = clamp(oldSize.x - (current.x / w), .05, 1);
				activeZone.size.y = clamp(oldSize.y - (current.y / h), .05, 1);
				activeZone.pos.x = oldPos.x + (oldSize.x - activeZone.size.x);
				activeZone.pos.y = oldPos.y + (oldSize.y - activeZone.size.y);
			}
		} else {
			activeZone.pos.x = current.x / w;
			activeZone.pos.y = current.y / h;
		}
	});

	$(document).on('mouseup', function(e){
		dragging = false;
		draggingNew = false;
		if (activeZone && (activeZone.size.x < 0.01 || activeZone.size.y < 0.01)){
			activeZone.remove();
			activeZone = null;
		}
		start = new Vector();
		if ($(e.target).closest('.image-scaler').length){
			renderZonesList();
		}
	});

	wrapper.on('mousedown', '.zone .point', function(e){
		activeZone = $(this).closest('.zone').data('zoneLink');
		start.x = e.pageX - bbox.left;
		start.y = e.pageY - bbox.top;
		start = start.clone().subtract(activeZone.pos.clone().scale(w, h));
		sides = getSides(e);
		dragging = true;
		oldSize = activeZone.size.clone();
		oldPos = activeZone.pos.clone();
		// console.log(start);
	});

	wrapper.closest('.card').find('.plus, .minus').click(function(){
		setTimeout(function(){
			bbox = wrapper[0].getBoundingClientRect();
			w = bbox.width;
			h = bbox.height;
		}, 210);
	});

	wrapper.on('mousedown', function(e){
		if ($(e.target).closest('.zone').length) return;
		if (zones.length >= colors.length) return;
		start.x = e.pageX - bbox.left;
		start.y = e.pageY - bbox.top;
		var newZone = new Zone();
		newZone.pos = start.clone().scale(1/w, 1/h);
		newZone.color = colors[zones.length];
		wrapper.append(newZone.node);
		zones.push(newZone);
		activeZone = newZone;
		draggingNew = true;
	});

});