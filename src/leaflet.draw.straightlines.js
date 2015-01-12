(function(){
    
    var orignalMouseMove = L.Draw.Polyline.prototype._onMouseMove;
    var originalMouseUp = L.Draw.Polyline.prototype._onMouseUp;

    var currentPoint, horizontalLine, verticalLine, lastPoint;

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
            // the last marker on the map is the currentpoint
            if(layer instanceof L.Marker){
                currentPoint = layer;
            }
        });

        if(currentPoint){
            
            var newLayerPoint = map.latLngToLayerPoint(currentPoint._latlng);
            
            if(horizontalLine){
                currentPoint._latlng.lat = lastPoint.lat;
                e.layerPoint.y = newLayerPoint.y;
            }

            if(verticalLine){
                currentPoint._latlng.lng = lastPoint.lng;
                e.layerPoint.x = newLayerPoint.x;
            }
            
            currentPoint.update();
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

        if(lastPoint && line._latlngs.length){
            if(horizontalLine){
                line._latlngs[line._latlngs.length - 1].lat = currentPoint._latlng.lat;
                line._latlngs[line._latlngs.length - 2].lat = currentPoint._latlng.lat;
            }
            else if(verticalLine){
                line._latlngs[line._latlngs.length - 1].lng = currentPoint._latlng.lng;
                line._latlngs[line._latlngs.length - 2].lng = currentPoint._latlng.lng;
            }

            line.redraw();
        }
    };
})();