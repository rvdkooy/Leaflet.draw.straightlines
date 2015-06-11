(function (L) {
    'use strict';
    var orignalMouseMove = L.Draw.Polyline.prototype._onMouseMove, straightline, dragging, map, start;

    window.onkeydown = function (e) {
        straightline = start(e);;
    };

    window.onkeyup = function () {
        straightline = false;
    };

    L.Draw.Polyline.prototype._onMouseMove = function (e) {
        orignalMouseMove.call(this, e);

        if (!straightline || dragging) return;

        var currentMarker = getLayerOfType(L.Marker);
        if (currentMarker) {
            var currentPosition = currentMarker.getLatLng();
            var currentPoint = map.latLngToLayerPoint(currentPosition);

            if (isHorizontal(e.layerPoint, currentPoint)) {
                e.layerPoint.y = currentPoint.y;
            }
            else {
                e.layerPoint.x = currentPoint.x;
            }

            this._updateGuide(e.layerPoint);
        }
    };

    L.Map.prototype.initStraightLines = function (options) {
        options = options || {};
        start = options.start || function (e) {
            return e.ctrlKey;
        };

        map = this;
        map.on('dragstart', function () {
            dragging = true;
        });
        map.on('dragend', function () {
            dragging = false;
        });
        map.on('mouseup', function () {
            setTimeout(function () {
                if (!straightline || dragging) return;

                var currentLine = getLayerOfType(L.Polyline);
                if (currentLine) {
                    var latLngs = currentLine.getLatLngs();
                    var lastPosition = latLngs[latLngs.length - 1];
                    var previousPosition = latLngs[latLngs.length - 2];

                    if (isHorizontal(lastPosition, previousPosition)) {
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

    function getLayerOfType(type) {
        var result = null;
        map.eachLayer(function (layer) {
            if (layer instanceof type) {
                result = layer;
            }
        });
        return result;
    }

    function isHorizontal(current, previous) {
        var currentPoint, previousPoint;

        if (current.x) {
            currentPoint = current;
        } else {
            currentPoint = map.latLngToLayerPoint(current);
        }
        if (previous.x) {
            previousPoint = previous;
        } else {
            previousPoint = map.latLngToLayerPoint(previous);
        }

        var diffX = Math.abs(currentPoint.x - previousPoint.x);
        var diffY = Math.abs(currentPoint.y - previousPoint.y);

        return diffY < diffX;
    }
})(window.L);