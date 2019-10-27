import React from 'react';
import Sidebar from './Sidebar.js';
import APIKey from './APIKey.js'

class GMap extends React.Component {

    mapeRef = React.createRef();

    constructor(props){
        super(props);
        this.success = this.success.bind(this);
        this.API = new APIKey();
        this.state = {
            currentLocation: 0
        };

        //https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=YOUR_API_KEY

        
    }

    componentDidMount() {
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key='+ this.API.googleMap +'&v=3.exp&libraries=geometry,drawing,places'
        script.async = true;
        script.defer = true;
        window.document.body.appendChild(script);

        script.addEventListener('load', () => {
            this.permission();
        });
    }

    createMap(position) {
        let map = new window.google.maps.Map(this.mapeRef.current, 
                                     {zoom: 4, center: position, mapTypeId: window.google.maps.MapTypeId.ROAD}
                                    );
            window.gmap = map;
        let marker = new window.google.maps.Marker({position: position, map: map});
        this.placeMarkers(map);

    }

    placeMarkers(map) {
        for (var i = 0; i < window.db.length; i++) {
            var coords = window.db[i];
            var latLng = new window.google.maps.LatLng(coords.lat,coords.long);
            var marker = new window.google.maps.Marker({
            position: latLng,
            map: map
            });
        }
    }

    permission(){
        const auth = navigator.geolocation.getCurrentPosition(this.success,this.error);
    }

    success(position){
        console.log(position);
        console.log(this);
        this.createMap({lat: position.coords.latitude, lng: position.coords.longitude});
    }

    error(err){
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    render() {
        return (
            <div>
                <div id="map" ref={this.mapeRef} style={{width:"100%", height:"100%", backgroundColor:"grey", position: "absolute"}}></div>
                <Sidebar />
            </div>
        );
    }
}

export default GMap;