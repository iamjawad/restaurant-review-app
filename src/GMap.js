import React from 'react';
import APIKey from './APIKey.js'
import imgRestaurant from './images/restaurant.png';
import location from './images/location.png';
import DataContext from './contexts/DataContext';
import NewRestaurant from './NewRestaurant';

class GMap extends React.Component {
    static contextType = DataContext;
    mapeRef = React.createRef();

    constructor(props){
        super(props);
        this.success = this.success.bind(this);
        this.nearbyCallback = this.nearbyCallback.bind(this);
        this.API = new APIKey();
        this.map = null;
        this.dragged_location = 0;
        this.state = {
            currentLocation: 0,
            newRestaurant:{
                display: false,
                position: 0
            }
        };

        this.infowindow = "";
        // this.createMap = this.createMap.bind(this);
        //https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=YOUR_API_KEY
        
    }

    getInfowindow(marker) {
        this.infowindow.setContent('<div style="width:400px; height:400px" id="pano"></div>')
        this.infowindow.open(this.map, marker);
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

    setStreetView(coords, id) {
        let panorama = new window.google.maps.StreetViewPanorama(
            document.getElementById("pano"), {
            position: coords,
            pov: {
                heading: 34,
                pitch: 10
            }
        });

        if (panorama.getStatus() === undefined) {
            return false;
        }
        console.log("GGGGGGG");
        this.map.setStreetView(panorama);
    }

    createMap(position) {
        window.clientPosition = position;
        window.gClickCoords = position;

        let props = this.props;
        window.gMap = new window.google.maps.Map(this.mapeRef.current, 
                                     {zoom: 16, center: position, mapTypeId: window.google.maps.MapTypeId.ROAD}
                                    );
        this.map = window.gMap;

        this.infowindow = new window.google.maps.InfoWindow({
            content: ''
        });

        let currentMarker = new window.google.maps.Marker({ position: position, map: this.map, draggable: false, title: 'You are here!',icon: location});
        let marker = new window.google.maps.Marker({position: position, map: this.map, draggable: true,});
        this.nearbyRestaurants();
        
        let clatLng = position;
        // var cityCircle = new window.google.maps.Circle({
        //     strokeColor: '#FF0000',
        //     strokeOpacity: 0.8,
        //     strokeWeight: 2,
        //     fillColor: '#FF0000',
        //     fillOpacity: 0.35,
        //     map: window.gMap,
        //     center: clatLng,
        //     radius: 1000
        //   });
        //   window.gCircle = cityCircle;
        //   cityCircle.setMap(this.map);
         //Add listener
         window.google.maps.event.addListener(window.gMap, "click", function (event) {
            let latitude = event.latLng.lat();
            let longitude = event.latLng.lng();
            let coords = [latitude, longitude];

            let latLng = new window.google.maps.LatLng(coords[0],coords[1]);
            marker.setPosition(latLng);
            window.gClickCoords = latLng;
        }); //end addListener

        window.google.maps.event.addListener(marker, "dragend", (event) => {
            window.gClickCoords = event.latLng;
            this.nearbyRestaurants(event.latLng);
        });

        // window.google.maps.event.addListener(this.map, 'dragend', function (event) { 
        //     // this.nearbyRestaurants(event.latLng);
        //     console.log(event);
        //  });

        this.userReviews();
        this.placeMarkers();
        this.setState({db: this.props.db});
        
    }

    placeMarkers() {
        const db = this.context.restaurants;
        
        for (let i = 0; i < db.length; i++) {
            let coords = db[i];
            let latLng = new window.google.maps.LatLng(coords.lat,coords.long);
            let marker = new window.google.maps.Marker({
            position: latLng,
            map: this.map,
            icon: {url: imgRestaurant}
            });

            // let infowindow = new window.google.maps.InfoWindow({
            //     content: '<div style="width:400px; height:400px" id="' + i + '"></div>'
            // });
            marker.addListener('click', () => {
                this.getInfowindow(marker);
                this.setStreetView(latLng);
            });
        }
    }

    nearbyRestaurants(draggedLocation = null) {
        let pyrmont = window.clientPosition;
        if(draggedLocation != null) {
            pyrmont = draggedLocation;
        }

        let request = {
            location: pyrmont,
            radius: '50000',
            type: ['restaurant']
            };
            
        let service = new window.google.maps.places.PlacesService(this.map);
        service.nearbySearch(request, this.nearbyCallback);
    }

    async nearbyCallback(results, status) {
        let restaurants = [];
        if (status == window.google.maps.places.PlacesServiceStatus.OK) {
          for (let i = 0; i < results.length; i++) {
            let place = results[i];
            this.createNearbyMarkers(results[i]);
            const newRestaurant = await this.createRestaurant(place);          
            restaurants.push(newRestaurant);
          }
        }
        this.context.addRestaurant(restaurants);
    }

    userReviews(placeID){

        if(placeID === undefined) {
            return [];
        }
        return new Promise((resolve => {

            var request = {
                placeId: placeID,
                fields: ['review']
              };

            const service = new window.google.maps.places.PlacesService(this.map);
            service.getDetails(request, (data) => { resolve(data)});

            // setTimeout(() => {
            //     resolve("I promised");
            // }, 2000);

        }));
    }
      
    async createRestaurant(restaurant) {

        if(!restaurant) {
            return false;
        }

        let ratings = await this.userReviews(restaurant.place_id);
        let reviews = [];       

        return new Promise(resolve => {

            if(ratings !== null && ratings.reviews !== undefined) {
                ratings.reviews.forEach(element => {
                    reviews.push({
                        stars: element.rating,
                        comment: element.text
                    });
                });
            }
            resolve({
                "id": restaurant.id,
                "restaurantName":restaurant.name,
                "address":restaurant.vicinity,
                "lat":restaurant.geometry.location.lat,
                "long":restaurant.geometry.location.lng,
                "ratings":reviews
                });
        });

        
    }

    createNearbyMarkers(place) {
        let marker = new window.google.maps.Marker({
            position: place.geometry.location,
            map: this.map,
            title: place.name,
            id: place.id,
            icon: imgRestaurant
            });
        
        marker.addListener('click', () => {
            
            if (this.setStreetView(place.geometry.location) === false) {
               this.infowindow.setContent("No street view available!");
               this.infowindow.open(this.map, marker);
            } else {
                this.getInfowindow(marker);
            }; 
            
        });
    }

    permission(){
        const auth = navigator.geolocation.getCurrentPosition(this.success,this.error);
    }

    success(position){
        this.createMap({lat: position.coords.latitude, lng: position.coords.longitude});
    }

    error(err){
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    render() {
        return (
            <div>
                <div id="map" ref={this.mapeRef} style={{width:"100%", height:"100%", backgroundColor:"grey", position: "absolute"}}></div>
                {/* <div id="pano"></div> */}
                <button className="c-button" value="My Location" />
                <div className="new-restaurant-popup" style={{ display: this.state.newRestaurant.display ? "block":"none"}}>
                    <NewRestaurant style={{ top: this.state.newRestaurant.position[0], left: this.state.newRestaurant.position[1]}} display={this.state.newRestaurant.display} />
                </div>
            </div>
        );
    }
}

export default GMap;