(function(undefined){
    
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

        if(dragging) return;
        
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

    L.Map.prototype.initStraightLines = function(){
        map = this;
        map.on('dragstart', function(){
            dragging = true;
        });
        map.on('dragend', function(){
            dragging = false;
        });
        map.on('mouseup', function(e){
            
            if(dragging) return;
            
            setTimeout(function(){
                
                var currentLine = getLayerOfType(L.Polyline);
            
                currentMarker = getLayerOfType(L.Marker);
                
                if(currentMarker){
                    
                    if(straightline && currentLine){
                         
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

    function isHorizontal(mousePosition){
        var latDiff = Math.abs(mousePosition.lat - lastPoint.lat);
        var lngDiff = Math.abs(mousePosition.lng - lastPoint.lng);

        return latDiff < lngDiff;
    }    
})();