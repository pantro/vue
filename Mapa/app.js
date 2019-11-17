Vue.component('v-select', VueSelect.VueSelect);
 
const { LMap, LTileLayer, LMarker, LTooltip, LPopup } = Vue2Leaflet;
 
const v_map = Vue.component('p-map', LMap); // Vue2Leaflet.Map
const v_tilelayer = Vue.component('p-tilelayer', LTileLayer ); // Vue2Leaflet.TileLayer
const v_marker = Vue.component('p-marker', LMarker); // Vue2Leaflet.Marker
const v_tooltip2 = Vue.component('p-tooltip2', LTooltip); // Vue2Leaflet.LTooltip
const v_popup = Vue.component('p-popup', LPopup); // Vue2Leaflet.LPopup
 
const BtileProviders = [
    {
        name: 'OpenStreetMap',
        visible: true,
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    },
    {
        name: 'OpenTopoMap',
        visible: false,
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    }
];

const show_mapas = Vue.component('mapa-simple', {
    props: ['mapdata'],
    data() {
        return {
            // Map Options
            zoom_def: 13,
            markers: [],
            tileLayer: null,
            layers: [],
            selectedTileSet: BtileProviders[0], 
            tileSets: BtileProviders,
            mapOptions_default: { zoomControl: false, attributionControl: false, zoomSnap: true },
            minZoom_def: 1,
            maxZoom_def: 20,
            show_mapsets_default: true,
        }
    },
    computed: {
        mapOptions() { return (this.mapdata.mapOptions) ? this.mapdata.mapOptions : this.mapOptions_default },
        minZoom() { return (this.mapdata.minZoom) ? this.mapdata.minZoom : this.minZoom_def },
        maxZoom() { return (this.mapdata.maxZoom) ? this.mapdata.maxZoom : this.maxZoom_def },
        zoom() { return (this.mapdata.zoom) ? this.mapdata.zoom : this.zoom_def },
         
        coordenadas() {return `${this.mapdata.coordx} - ${this.mapdata.coordy}`},
        // Maps
        coords() {
            return UTMXYToLatLon2 (this.mapdata.coordx, this.mapdata.coordy); // UTMXYToLatLon (x, y, zone, southhemi, latlon);
        },
        center() { return L.latLng(this.coords)},
        label() { return this.mapdata.label },
    },
    methods: {
        get_coordenadas(e) {
            let coord = e.latlng;
            let lat = coord.lat;
            let lng = coord.lng;
            // console.log("You clicked the map at latitude: " + lat + " and longitude: " + lng);
            let xy = LatLonToUTMXY2(lat, lng, 30);
            // console.log("You clicked the map at X: " + xy[0] + " and Y: " + xy[1]);
            this.$emit('get_coordenadas', xy);
        }, 
    },
    template: `
<div>
    <p-map id="map" ref="map" 
        :zoom="zoom" 
        :center="center"
        :min-zoom="minZoom"
        :max-zoom="maxZoom"
        :options="mapOptions"
        @click="get_coordenadas"
        class="map2">
        <p-tilelayer ref="tile" :url="selectedTileSet.url"></p-tilelayer>
        <p-marker :lat-lng="coords">
            <p-popup :content="label" v-if="mapdata.with_popup"></p-popup>
            <p-tooltip2 :content="label" v-if="mapdata.with_tooltip"></p-tooltip2>
        </p-marker>
    </p-map>  
</div>
`
})

var app = new Vue({
    el: "#app",
    data() {
        return {
            coordx: 125000,
            coordy: 4140000,
            label: 'Punto de ejemplo',
        }
    },
    computed: {
        coordenadas() {return `${this.coordx} - ${this.coordy}`},
        coords() {
            // UTMXYToLatLon (x, y, zone, southhemi, latlon);
            return UTMXYToLatLon2 (this.coordx, this.coordy);
        },
        mapdata() {
            return {
                coordx: this.coordx,
                coordy: this.coordy,
                with_popup: false,
                with_tooltip: true,
                // selectedTileSet: this.selectedTileSet, // Solo sirve si show_mapsets es false
                // minZoom: 1, // opcional
                // maxZoom: 20, // opcional
                // mapOptions: , // opcional
                map_class: 'map2', // opcional
                label: this.label,
            }
        },
    },
    methods: {
        get_coordenadas(info) {
            console.log(info)
            this.coordx = info[0];
            this.coordy = info[1];
        },
    },
    template:
    `
    <div>
    <div class="title-row">
            <span>CoordX:</span><input type="text" v-model="coordx">
            <span>CoordY:</span><input type="text" v-model="coordy">
            <span>Label:</span><input type="text" v-model="label">
            Geograficas: {{ coords }}
        </div>
        <mapa-simple :mapdata="mapdata" @get_coordenadas=get_coordenadas></mapa-simple>
    </div>
    `
})