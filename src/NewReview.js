import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar} from '@fortawesome/free-regular-svg-icons';
import DataContext from './contexts/DataContext';

class NewReview extends React.Component {
    static contextType = DataContext;

    constructor(props) {
        super(props);

        this.ratingInput = [
            {id:1, rating:1, icon:farStar},
            {id:2, rating:2, icon:farStar},
            {id:3, rating:3, icon:farStar},
            {id:4, rating:4, icon:farStar},
            {id:5, rating:5, icon:farStar},
        ];

        this.state = {
            ratingInput:this.ratingInput,
            stars:0,
            comment:'',
            db: []
        }
    }

    saveReview() {
        
        let review  = {stars: this.state.stars, comment: this.state.comment};

        this.context.addRating(this.props.id, review);

        this.setState(state => {
            // const db = [...state.db, {stars: this.state.stars, comment: this.state.comment}];
            return {
                stars:0,
                comment:'',
            };
        });

        this.ratingInput.forEach(element => {
            element.icon = farStar;
        });
        
    }

    componentDidMount() {
        this.setState({
            db: this.context.restaurants.ratings
        });
    }    

    ratingInputClick(id) {

        this.setState({stars:id});
        for (let index = 0; index < 5; index++) {
            const element = this.ratingInput[index];

            if( index >= id ){
                element.icon = farStar;
            } else {
                element.icon = faStar;
            }
            
            this.setState({ratingInput:this.ratingInput});
        }
    }

    ratingInputUI() {

        let stars = [];

        this.ratingInput.forEach((element, i) => {
           stars.push(<FontAwesomeIcon id={element.id} onClick={this.ratingInputClick.bind(this, element.id)} key={i} icon={element.icon} />);
        });

        return(
            <div className="rating-input-box">
                {stars}
            </div>
        );
    }

    updateComment(e) {
        this.setState(
            {
                comment:e.target.value
            }
        );
    }

    newReviewUI() {
        return(
            <div className="new-review-box">
                <textarea value={this.state.comment} onChange={e => this.updateComment(e)} id="newreview"></textarea>
                <div className="actions">
                    <button className="save-review c-button" onClick={e => this.saveReview()} >Submit</button>
                    <button className="save-review-cancel c-button">Cancel</button>
                </div>
            </div>
        );
    }

    render() {
        return(
            <div>
                {this.ratingInputUI()}
                {this.newReviewUI()}
            </div>
        );
    }
}

export default NewReview;