import * as ActionTypes from './ActionTypes';

export const Comments = (state = { 
        errMess: null, 
        comments: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_COMMENTS:
            return {...state, isLoading: false, errMess: null, comments: action.payload};

        case ActionTypes.COMMENTS_FAILED:
            return {...state, isLoading: false, errMess: action.payload, comments: []};

        case ActionTypes.ADD_COMMENT:
            var comment = action.payload;
            comment.dishId = parseInt(comment.dishId);
            comment.rating = parseInt(comment.rating);
            comment.id = state.comments.length.toString();
            comment.date = new Date().toISOString();
            var updatedComments = state.comments.concat(comment);
            // Sort the comments array based on their dates (in ascending order)
            updatedComments.sort((a, b) => new Date(a.date) - new Date(b.date));
             // Return the updated state with the sorted comments array
            return {...state, comments: updatedComments};

        default:
          return state;
      }
}