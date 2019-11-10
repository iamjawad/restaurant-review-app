import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

class RestaurantFilter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            startRange:1,
            endRange:5
        }
    }

    getRange() {
        const range = [this.state.startRange, this.state.endRange];
        return range;
    }

    render(){
        return(
            <div className="rest-filter">
                <button className="c-button" onClick={this.props.newrest} >+</button>
                <span className="rating-filter"><FontAwesomeIcon icon={faStar} /></span>
                <select value={this.state.startRange} onChange={(e) => { this.setState({ startRange: parseInt(e.target.value) }, () => this.props.updateRange(this.getRange())); }}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <span className="to-range">-</span>
                <select value={this.state.endRange} onChange={(e) => { this.setState({ endRange: parseInt(e.target.value) }, () => this.props.updateRange(this.getRange()));}}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div>
        );
    }
}

export default RestaurantFilter;