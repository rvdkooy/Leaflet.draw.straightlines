/*
    Leaflet.draw.straightlines, a plugin that allows you to draw straight lines.
    Ronald van der Kooij

    https://github.com/rvdkooy/Leaflet.draw.straightlines
    https://github.com/rvdkooy
*/

(function(undefined){
    var orignalMouseMove = L.Draw.Polyline.prototype._onMouseMove;
    var originalMouseUp = L.Draw.Polyline.prototype._onMouseUp;

    var mousemarker, map, horizontalLine, verticalLine;

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

        if(!map){
           map =  e.target;
        }
        
        if(!horizontalLine && !verticalLine) return;
        
        if(!mousemarker){
             map.eachLayer(function(layer){
            
                if(layer instanceof L.Draw.Polyline){
                    mousemarker = layer;
                }
            });
        }

        
            
            var newLayerPoint = map.latLngToLayerPoint(mousemarker._latlng);
            
            if(horizontalLine){
                mousemarker._latlng.lat = this.lastPoint.lat;
                e.layerPoint.y = newLayerPoint.y;
            }

            if(verticalLine){
                mousemarker._latlng.lng = this.lastPoint.lng;
                e.layerPoint.x = newLayerPoint.x;
            }
            
            mousemarker.update();
            this._updateGuide(e.layerPoint);
        
    };

    L.Draw.Polyline.prototype._onMouseUp = function(e){
        originalMouseUp.call(this, e);

        var line;
        
        map.eachLayer(function(layer){
            
            if(layer._path){
                line = layer;
            }
        });
        
        this.lastPoint = e.latlng;

        if(!horizontalLine && !verticalLine) return;

        if(this.lastPoint && line._latlngs.length){
            if(horizontalLine){
                line._latlngs[line._latlngs.length - 1].lat = mousemarker._latlng.lat;
                line._latlngs[line._latlngs.length - 2].lat = mousemarker._latlng.lat;
            }
            else if(verticalLine){
                line._latlngs[line._latlngs.length - 1].lng = mousemarker._latlng.lng;
                line._latlngs[line._latlngs.length - 2].lng = mousemarker._latlng.lng;
            }

            line.redraw();
        }
    };
})();