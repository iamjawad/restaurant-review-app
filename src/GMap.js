import React from 'react';
import Sidebar from './Sidebar.js';
import APIKey from './APIKey.js'

class GMap extends React.Component {

    mapeRef = React.createRef();

    constructor(props){
        super(props);
        this.success = this.success.bind(this);
        this.API = new APIKey();
        this.map = null;
        this.state = {
            currentLocation: 0,
            db: [...window.db]
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

    componentDidUpdate(prevProps, prevState) {
        if (prevState.db.length !== window.db.length) {
            this.setState({db: this.props.db});
            console.log(this.props.db);
            console.log("Tooolo");
            this.click();
            // this.placeMarker();
        }
        console.log("Tooolo123");
    }

    static getDerivedStateFromProps(props, current_state) {
        console.log("42342342343");
        if (props.db.length !== current_state.db.length) {
          return {
            db: props.db,
          }
        }
        return null
      }

    createMap(position) {

        let props = this.props;
        window.gMap = new window.google.maps.Map(this.mapeRef.current, 
                                     {zoom: 4, center: position, mapTypeId: window.google.maps.MapTypeId.ROAD}
                                    );
        this.map = window.gMap;
        let marker = new window.google.maps.Marker({position: position, map: this.map});

         //Add listener
         window.google.maps.event.addListener(window.gMap, "click", function (event) {
            let latitude = event.latLng.lat();
            let longitude = event.latLng.lng();
            let coords = [latitude, longitude];
            console.log( latitude + ', ' + longitude );

            let radius = new window.google.maps.Circle({map: this.map,
                radius: 100,
                center: event.latLng,
                fillColor: '#777',
                fillOpacity: 0.1,
                strokeColor: '#AA0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                draggable: true,    // Dragable
                editable: true      // Resizable
            });

            // Center of map
            window.gMap.panTo(new window.google.maps.LatLng(latitude,longitude));
            window.gCoords = coords;
        }); //end addListener
        
        
        this.placeMarkers();
        this.setState({db: this.props.db});
    }

    placeMarkers() {
        for (var i = 0; i < window.db.length; i++) {
            var coords = window.db[i];
            var latLng = new window.google.maps.LatLng(coords.lat,coords.long);
            var marker = new window.google.maps.Marker({
            position: latLng,
            map: this.map
            });
        }
    }

    click() {
        alert("hello");
    }

    addMarker() {
        var coords = window.db[window.db.length - 1];
        var latLng = new window.google.maps.LatLng(coords.lat,coords.long);
        var marker = new window.google.maps.Marker({
        position: latLng,
        map: this.map
        });
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
            </div>
        );
    }
}

export default GMap;