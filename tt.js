//$.ajax({dataType:'script',cache:true,url:'http://static.thetabx.net/js/wow/tt.js'});
var cache = {},
	STATIC_URL = "http://static.thetabx.net/",
	API_URL = "http://api.thetabx.net/tgc/3/",
	CSS_URL = "http://static.thetabx.net/css/wow/wowheadlike.css",
	hovering = false;

function showTooltip (data) {
	jQuery("#w_tooltip").html(data).show().trigger("mousemove");
}
function hideTooltip () {
	jQuery("#w_tooltip").hide().html("");
}
function appendTooltips () {
	jQuery(document).on("mouseenter mouseleave", "a[href*=spell\\=], a[href*=item\\=]", function(e) {
		if(e.type == "mouseenter") {
			var objMatch = jQuery(this).attr("href").match(/(item|spell)=(\d+)/);
			if(!objMatch || !objMatch[1] || !objMatch[2]) { return; }
			var objId = objMatch[2],
				prefix = false;
			switch(objMatch[1]) {
				case "item": prefix = "i";
					break;
				case "spell": prefix = "s";
					break;
			}
			if(!prefix) { return; }

			var hash = prefix + objId,
				obj = cache[hash];
			hovering = hash;
			if(obj && obj.cache) {
				showTooltip(obj.cache);
			}
			else {
				if(!obj) {
					obj = {id: objId, hash: hash, url: {}};
					obj.url[objMatch[1]] = objId;
					obj.url.tooltip = 1;
					cache[obj.hash] = obj;
				}
				jQuery.ajax({
					url: API_URL,
					type: "GET",
					data: obj.url,
					cache: true,
					success: function (data) {
						obj.cache = data;
						if(hovering == obj.hash) {
							showTooltip(obj.cache);
						}
					}
				});
			}
		}
		else {
			hovering = false;
			hideTooltip();
		}
	});
}

jQuery(document).ready(function () {
	var $tt = jQuery("<div>", {id: "w_tooltip", style: "position: absolute; z-index:200;"}).hide(), offsetX, offsetY;
	jQuery("body").prepend($tt);
	jQuery(document).mousemove(function(e) {
		if(e.pageX) {
			offsetX = e.pageX + 11;
			offsetY = e.pageY + 15;
		}
		if(hovering) {
			$tt.offset({left: offsetX, top: offsetY});
		}
	});
	appendTooltips();
	if(jQuery("head link[href='" + CSS_URL + "']").length) { return; }
	jQuery	("head").append(jQuery("<link>", {rel: "stylesheet", type: "text/css", href: CSS_URL}));
});
