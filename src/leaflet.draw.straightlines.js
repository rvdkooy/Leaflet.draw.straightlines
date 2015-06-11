(function(undefined){
    'use strict';
    var orignalMouseMove = L.Draw.Polyline.prototype._onMouseMove, straightline, dragging;

    window.onkeydown = function(e){
        straightline = e.ctrlKey;
    };

    window.onkeyup = function(e){
        straightline = false;
    };

    L.Draw.Polyline.prototype._onMouseMove = function(e){
        orignalMouseMove.call(this, e);

        if(!straightline || dragging) return;

        var currentMarker = getLayerOfType(L.Marker);
        if(currentMarker)
        {
            var currentPosition = currentMarker.getLatLng();
            var currentPoint = map.latLngToLayerPoint(currentPosition);

            if(isHorizontal(e.latlng, currentPosition)){
                e.layerPoint.y = currentPoint.y;
            }
            else{
                e.layerPoint.x = currentPoint.x;
            }

            this._updateGuide(e.layerPoint);
        }
    };

    L.Map.prototype.initStraightLines = function(){
        var map = this;
        map.on('dragstart', function(){
            dragging = true;
        });
        map.on('dragend', function(){
            dragging = false;
        });
        map.on('mouseup', function(e){

            setTimeout(function(){
                if(!straightline || dragging) return;

                var currentLine = getLayerOfType(L.Polyline);
                if(currentLine){
                    var latLngs = currentLine.getLatLngs();
                    var lastPosition = latLngs[latLngs.length - 1];
                    var previousPosition = latLngs[latLngs.length - 2];

                    if(isHorizontal(lastPosition, previousPosition)){
                        lastPosition.lat = previousPosition.lat;
                    }
                    else {
                        lastPosition.lng = previousPosition.lng;
                    }
                    currentLine.redraw();
                    getLayerOfType(L.Marker).update();
                }
            });
        });
    };

    function getLayerOfType(type){
        var result;
        map.eachLayer(function(layer){
            if(layer instanceof type){
                result = layer;
            }
        });
        return result;
    }

    function isHorizontal(mousePosition, lastPoint){
        var latDiff = Math.abs(mousePosition.lat - lastPoint.lat);
        var lngDiff = Math.abs(mousePosition.lng - lastPoint.lng);

        return latDiff < lngDiff;
    }
})();