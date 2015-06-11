(function(undefined){
    'use strict';
    var orignalMouseMove = L.Draw.Polyline.prototype._onMouseMove, currentMarker, straightline, 
        lastPoint, map, dragging;
    
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
        map = this;
        map.on('dragstart', function(){
            dragging = true;
        });
        map.on('dragend', function(){
            dragging = false;
        });
        map.on('mouseup', function(e){
            
            setTimeout(function(){
                if(dragging) return;

                var currentLine = getLayerOfType(L.Polyline);
            
                currentMarker = getLayerOfType(L.Marker);
                
                if(currentMarker){
                    
                    if(straightline && currentLine){
                         
                        var latLngs = currentLine.getLatLngs();
                        
                        if(lastPoint && latLngs.length){
                            
                            if(isHorizontal(e.latlng, lastPoint)){
                                latLngs[latLngs.length - 1].lat = lastPoint.lat;
                                latLngs[latLngs.length - 2].lat = lastPoint.lat;
                            }
                            else {
                                latLngs[latLngs.length - 1].lng = lastPoint.lng;
                                latLngs[latLngs.length - 2].lng = lastPoint.lng;   
                            }
                            currentLine.redraw();
                            currentMarker.update();
                        }
                    }
                    
                    lastPoint = currentMarker.getLatLng();
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