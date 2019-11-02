import React from 'react';
import APIKey from './APIKey.js'
import imgRestaurant from './images/restaurant.png';
import DataContext from './contexts/DataContext';

class GMap extends React.Component {
    static contextType = DataContext;
    mapeRef = React.createRef();

    constructor(props){
        super(props);
        this.success = this.success.bind(this);
        this.nearbyCallback = this.nearbyCallback.bind(this);
        this.API = new APIKey();
        this.map = null;
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
        window.clientPosition = position;
        window.gClickCoords = position;

        let props = this.props;
        window.gMap = new window.google.maps.Map(this.mapeRef.current, 
                                     {zoom: 16, center: position, mapTypeId: window.google.maps.MapTypeId.ROAD}
                                    );
        this.map = window.gMap;
        let marker = new window.google.maps.Marker({position: position, map: this.map, draggable: true,title: 'You are here!',});
        this.nearbyRestaurants();
        
        let clatLng = position;
        var cityCircle = new window.google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: window.gMap,
            center: clatLng,
            radius: 1000
          });
          window.gCircle = cityCircle;
          cityCircle.setMap(this.map);
         //Add listener
         window.google.maps.event.addListener(window.gMap, "click", function (event) {
            let latitude = event.latLng.lat();
            let longitude = event.latLng.lng();
            let coords = [latitude, longitude];

            let latLng = new window.google.maps.LatLng(coords[0],coords[1]);
            marker.setPosition(latLng);
            window.gClickCoords = latLng;
        }); //end addListener

        window.google.maps.event.addListener(marker, "dragend", function (event) {
            window.gClickCoords = event.latLng;
        });
        this.userReviews();
        this.placeMarkers();
        this.setState({db: this.props.db});
    }

    placeMarkers() {
        const db = this.context.restaurants;
        for (var i = 0; i < db.length; i++) {
            var coords = db[i];
            var latLng = new window.google.maps.LatLng(coords.lat,coords.long);
            var marker = new window.google.maps.Marker({
            position: latLng,
            map: this.map,
            icon: {url: imgRestaurant}
            });
        }
    }

    nearbyRestaurants() {
        let pyrmont = window.clientPosition;

        let request = {
            location: pyrmont,
            radius: '1000',
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
            icon: imgRestaurant
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
                <button className="c-button" value="My Location" />
            </div>
        );
    }
}

export default GMap;