(function(undefined){
    
    var orignalMouseMove = L.Draw.Polyline.prototype._onMouseMove;
    var originalMouseUp = L.Draw.Polyline.prototype._onMouseUp;

    var currentMarker, currentLine, horizontalLine, verticalLine, lastPoint, map;

    window.onkeydown = function(e){
        horizontalLine = e.shiftKey;
        verticalLine = e.ctrlKey;
    };

    window.onkeyup = function(e){
        horizontalLine = false;
        verticalLine = false;
    };

    L.Draw.Polyline.prototype._onMouseMove = function(e){
        orignalMouseMove.call(this, e);
        
        map = e.target;

        if((horizontalLine || verticalLine) && currentMarker)
        {
            var currentPoint = map.latLngToLayerPoint(currentMarker.getLatLng());
            
            if(horizontalLine){
                currentMarker.setLatLng(L.latLng(lastPoint.lat, currentMarker.getLatLng().lng));
                e.layerPoint.y = currentPoint.y;
            }

            if(verticalLine){
                currentMarker.setLatLng(L.latLng(currentMarker.getLatLng().lat, lastPoint.lng));
                e.layerPoint.x = currentPoint.x;
            }
            
            currentMarker.update();
            this._updateGuide(e.layerPoint);
        }
    };

    L.Draw.Polyline.prototype._onMouseUp = function(e){
        originalMouseUp.call(this, e);

        lastPoint = e.latlng;
        currentLine = getLayerOfType(L.Polyline);

        if(horizontalLine || verticalLine){
             var latLngs = currentLine.getLatLngs();

            if(lastPoint && latLngs.length){
                
                if(horizontalLine){
                    latLngs[latLngs.length - 1].lat = currentMarker.getLatLng().lat;
                    latLngs[latLngs.length - 2].lat = currentMarker.getLatLng().lat;
                }
                else if(verticalLine){
                    latLngs[latLngs.length - 1].lng = currentMarker.getLatLng().lng;
                    latLngs[latLngs.length - 2].lng = currentMarker.getLatLng().lng;
                }
                currentLine.redraw();
                
            }
        }
        currentMarker = getLayerOfType(L.Marker);
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
})();