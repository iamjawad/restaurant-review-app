import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHotel } from '@fortawesome/free-solid-svg-icons';
import imgRestaurant from './images/restaurant.png';
import DataContext from './contexts/DataContext';

class NewRestaurant extends React.Component{

    static contextType = DataContext;
    
    constructor(props) {
        super(props);

        this.state = {

            restaurant: {
                "id":0,
                "restaurantName":"",
                "address":"",
                "lat":0,
                "long":0,
                "ratings":[]
             }
        }        
    }

    update(property) {

        const prop = property;
        let coords = window.gClickCoords;
        if( typeof coords === 'undefined') {
            return false;
        }

        this.setState((prevState) => 
            ({
                restaurant: {
                    ...prevState.restaurant, 
                    ...prop,
                    lat: coords[0],
                    long: coords[1]
                }
            })
            )
    }

    saveRestaurant() {
        const restaurantID = this.context.restaurants[this.context.restaurants.length-1].id + 1;
        // restaurant.id = this.context.restaurants[this.context.restaurants.length -1].id + 1;
        this.setState((prevState) => ({
                                        restaurant: {
                                            ...prevState.restaurant,
                                            id:restaurantID
                                        }}), 
            () => {this.context.addRestaurant([this.state.restaurant]);
                this.addMarker(window.gClickCoords);
                this.resetState();
            }
        );
    }

    resetState() {
        this.setState({
            restaurant: {
                "id":0,
                "restaurantName":"",
                "address":"",
                "lat":0,
                "long":0,
                "ratings":[]
             }
        });
    }

    addMarker(coords) {
        var marker = new window.google.maps.Marker({
        position: window.gClickCoords,
        map: window.gMap,
        icon:{
            url: imgRestaurant
        }
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