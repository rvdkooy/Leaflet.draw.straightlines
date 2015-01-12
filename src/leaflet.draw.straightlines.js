(function(){
    
    var orignalMouseMove = L.Draw.Polyline.prototype._onMouseMove;
    var originalMouseUp = L.Draw.Polyline.prototype._onMouseUp;

    var currentMarker, horizontalLine, verticalLine, lastPoint;

    window.onkeydown = function(e){
        if(e.shiftKey && !horizontalLine) {
            horizontalLine = true;
        }
        if(e.ctrlKey){
            verticalLine = true;
        }
    };

    window.onkeyup = function(e){
        horizontalLine = false;
        verticalLine = false;
    };


    L.Draw.Polyline.prototype._onMouseMove = function(e){
        orignalMouseMove.call(this, e);

        if(!horizontalLine && !verticalLine) return;
        
        e.target.eachLayer(function(layer){
            // the last marker on the map is the currentMarker
            if(layer instanceof L.Marker){
                currentMarker = layer;
            }
        });

        if(currentMarker){
            
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

        var line;
        
        e.target.eachLayer(function(layer){
            // the last Polyline on the map the one we just drew
            if(layer instanceof L.Polyline){
                line = layer;
            }
        });
        
        lastPoint = e.latlng;

        if(!horizontalLine && !verticalLine) return;

        var latLngs = line.getLatLngs();
        
        if(lastPoint && latLngs.length){
            
            if(horizontalLine){
                latLngs[latLngs.length - 1].lat = currentMarker.getLatLng().lat;
                latLngs[latLngs.length - 2].lat = currentMarker.getLatLng().lat;
            }
            else if(verticalLine){
                latLngs[latLngs.length - 1].lng = currentMarker.getLatLng().lng;
                latLngs[latLngs.length - 2].lng = currentMarker.getLatLng().lng;
            }

            line.redraw();
        }
    };
})();