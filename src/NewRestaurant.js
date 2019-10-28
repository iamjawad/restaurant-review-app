import React from 'react';

class NewRestaurant extends React.Component{
    
    constructor(props) {
        super(props);

        this.state = {

            restaurant: {
                "restaurantName":"",
                "address":"",
                "lat":0,
                "long":0,
                "ratings":[]
             }
        }
        // this.update = this.update.bind(this);
    }

    update(property) {

        const prop = property;

        if( typeof window.coords === 'undefined') {
            return false;
        }

        this.setState((prevState) => 
            ({
                restaurant: {
                    ...prevState.restaurant, 
                    ...prop,
                    lat: window.gCoords[0],
                    long: window.gCoords[1]
                }
            })
            )
    }

    saveRestaurant() {
        window.db.push(this.state.restaurant);
        this.setState({
            restaurant: {
                "restaurantName":"",
                "address":"",
                "lat":0,
                "long":0,
                "ratings":[]
             }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.db.length !== window.db.length) {
            this.props.update();
            this.addMarker();
        }

    }

    addMarker() {
        var coords = window.db[window.db.length - 1];
        var latLng = new window.google.maps.LatLng(coords.lat,coords.long);
        var marker = new window.google.maps.Marker({
        position: latLng,
        map: window.gMap
        });
    }

    render() {
        return(
            <div className="new-restaurant-box" style={{display: this.props.display ? "block" : "none"}}>
                <div className="new-res-lable">New Restaurant</div>
                <input onChange={e => this.update({restaurantName: e.target.value})} className="new-res-name" value={this.state.restaurant.restaurantName} placeholder="Restaurant Name" />
                <input onChange={e => this.update({address: e.target.value})} className="new-res-address" value={this.state.restaurant.address} placeholder="Address" />
                <div className="actions">
                    <button className="save-review c-button" onClick={() => {this.saveRestaurant(); this.props.toggle()}} >Submit</button>
                    <button onClick={this.props.toggle} className="save-review-cancel c-button">Cancel</button>
                </div>
            </div>
        );
    }
}

export default NewRestaurant;