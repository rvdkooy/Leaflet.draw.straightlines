(function(undefined){
    
    var orignalMouseMove = L.Draw.Polyline.prototype._onMouseMove;
    var originalMouseUp = L.Draw.Polyline.prototype._onMouseUp;

    var currentMarker, straightline, lastPoint, map, clickedOnMarker;

    window.onkeydown = function(e){
        straightline = e.ctrlKey;
    };

    window.onkeyup = function(e){
        straightline = false;
    };

    L.Draw.Polyline.prototype._onMouseMove = function(e){
        orignalMouseMove.call(this, e);
        
        map = e.target;

        map.on('draw:drawstop', function (e) {
            lastPoint = null;
        });

        if((straightline) && currentMarker)
        {
            var currentPoint = map.latLngToLayerPoint(currentMarker.getLatLng());
            
            if(isHorizontal(e.latlng)){
                currentMarker.setLatLng(L.latLng(lastPoint.lat, currentMarker.getLatLng().lng));
                e.layerPoint.y = currentPoint.y;
            }
            else{
                currentMarker.setLatLng(L.latLng(currentMarker.getLatLng().lat, lastPoint.lng));
                e.layerPoint.x = currentPoint.x;
            }

            this._updateGuide(e.layerPoint);
            currentMarker.update();
        }
    };

    L.Draw.Polyline.prototype._onMouseUp = function(e){
        originalMouseUp.call(this, e);

        var currentLine = getLayerOfType(L.Polyline);
        
        currentMarker = getLayerOfType(L.Marker);
        
        currentMarker.on("mousedown", function(){
            clickedOnMarker = true;
        });
        
        if(clickedOnMarker){
            clickedOnMarker = false;
            return;
        }
        
        if(straightline){
             
            var latLngs = currentLine.getLatLngs();
            
            if(lastPoint && latLngs.length){
                
                if(isHorizontal(e.latlng)){
                    latLngs[latLngs.length - 1].lat = lastPoint.lat;
                    latLngs[latLngs.length - 2].lat = lastPoint.lat;
                }
                else {
                    latLngs[latLngs.length - 1].lng = lastPoint.lng;
                    latLngs[latLngs.length - 2].lng = lastPoint.lng;   
                }
                currentLine.redraw();
            
            }
        }
        
        lastPoint = currentMarker.getLatLng();
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

    function isHorizontal(mousePosition){
        var latDiff = Math.abs(mousePosition.lat - lastPoint.lat);
        var lngDiff = Math.abs(mousePosition.lng - lastPoint.lng);

        return latDiff < lngDiff;
    }
})();