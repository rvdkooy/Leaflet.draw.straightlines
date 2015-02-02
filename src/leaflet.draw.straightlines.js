(function(undefined){
    
    var orignalMouseMove = L.Draw.Polyline.prototype._onMouseMove, 
        originalMarkerDrag = L.Handler.MarkerDrag.prototype._onDrag,
        originalDragStart = L.Handler.MarkerDrag.prototype._onDragStart,
        currentMarker, straightline, 
        lastPoint, map, draggingMap, origDragMarkerPosition;
    
    window.onkeydown = function(e){
        straightline = e.ctrlKey;
    };

    window.onkeyup = function(e){
        straightline = false;
    };

    L.Draw.Polyline.prototype._onMouseMove = function(e){
        orignalMouseMove.call(this, e);

        if(draggingMap) return;
        
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

    // L.Handler.MarkerDrag.prototype._onDragEnd = function(e){
    //     origDragMarkerPosition = null;
    // };
    

    L.Handler.MarkerDrag.prototype._onDragStart = function(e){

        originalDragStart.call(this, e);
        origDragMarkerPosition = map.layerPointToLatLng(e.target._newPos);
    };

    L.Handler.MarkerDrag.prototype._onDrag = function(e){
        originalMarkerDrag.call(this, e);

        if(draggingMap) return;

        if((straightline))
        {
            


            // for now cancel the drag end
            //var originalDragEnd = L.Handler.MarkerDrag.prototype._onDragEnd;

            L.Handler.MarkerDrag.prototype._onDragEnd = function(e){
                //L.Handler.MarkerDrag.prototype._onDragEnd = originalDragEnd
            };

            

            if(isHorizontal(this._marker.getLatLng(), origDragMarkerPosition)) {
                this._marker.setLatLng(L.latLng(origDragMarkerPosition.lat, this._marker.getLatLng().lng));
            }
            else {
                this._marker.setLatLng(L.latLng(this._marker.getLatLng().lat, origDragMarkerPosition.lng));
            }

            this._marker.update();
            this._marker
                .fire('move', {latlng: this._marker.getLatLng()})
                .fire('drag');
        }
    }

    L.Map.prototype.initStraightLines = function(){
        map = this;
        
        map.on('dragstart', function(){
            draggingMap = true;
        });
        map.on('dragend', function(){
            draggingMap = false;
        });
        // map.on('mouseup', function(e){
            
        //     if(draggingMap) return;
            
        //     setTimeout(function(){
                
        //         var currentLine = getLayerOfType(L.Polyline);
            
        //         currentMarker = getLayerOfType(L.Marker);
                
        //         if(currentMarker){
                    
        //             if(straightline && currentLine){
                         
        //                 var latLngs = currentLine.getLatLngs();
                        
        //                 if(lastPoint && latLngs.length){
                            
        //                     if(isHorizontal(e.latlng)){
        //                         latLngs[latLngs.length - 1].lat = lastPoint.lat;
        //                         latLngs[latLngs.length - 2].lat = lastPoint.lat;
        //                     }
        //                     else {
        //                         latLngs[latLngs.length - 1].lng = lastPoint.lng;
        //                         latLngs[latLngs.length - 2].lng = lastPoint.lng;   
        //                     }
        //                     currentLine.redraw();
        //                     currentMarker.update();
        //                 }
        //             }
                    
        //             lastPoint = currentMarker.getLatLng();
        //         }    
        //     });            
        // });
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

    function isHorizontal(mousePosition, basedOn){
        
        basedOn = basedOn || lastPoint;

        var latDiff = Math.abs(mousePosition.lat - basedOn.lat);
        var lngDiff = Math.abs(mousePosition.lng - basedOn.lng);

        return latDiff < lngDiff;
    }    
})();