import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

class RestaurantFilter extends React.Component {
    render(){
        return(
            <div className="rest-filter">
                <span className="rating-filter"><FontAwesomeIcon icon={faStar} /></span>
                <select>
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>
                <span className="to-range">-</span>
                <select>
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>
            </div>
        );
    }
}

export default RestaurantFilter;