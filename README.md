# Leaflet.draw.straightlines
Leaflet.draw plugin that allows you to draw straight lines

When using this plugin you can draw straight lines with Leaflet.draw by just pressing the ctrl or shift key.

To compile the sources:

```
npm run compile
```

To use the plugin:
``` javascript
var map = L.map('map').setView([51.505, -0.09], 13);
map.initStraightLines();
```

Alternatively specify a function to start the straightlines functionality. For example with the shift key:
``` javascript
var map = L.map('map').setView([51.505, -0.09], 13);
map.initStraightLines({
    startFn: function (e) {
        return e.shiftKey;
    }
});
```
