import React, { Component } from 'react'
import {Card, CardImg, CardText, CardBody, Modal, ModalHeader, ModalBody, CardTitle, Breadcrumb, BreadcrumbItem, Button, Row, Col, Label} from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';


const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);
class CommentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {

            isModalOpen: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }
    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }
    handleSubmit(values) {
      this.toggleModal();
      this.props.addComment(this.props.dishId, values.rating, values.name, values.comment);
        // event.preventDefault();
    }
    render() {
        return (
            <div>
                 <Button outline onClick={this.toggleModal}>
                    <span className="fa fa-pencil" /> Submit Comment
                </Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <Row className="form-group">
                                <Label htmlFor="rating" md={12}>
                                    Rating
                                </Label>
                                <Col md={12}>
                                    <Control.select
                                        model=".rating"
                                        id="rating" 
                                        name="rating"
                                        className="form-control"
                                    >
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="name" md={12}>Your Name</Label>
                                <Col md={12}>
                                    <Control.text model=".name" id="name" name="name"
                                        placeholder="Your Name"
                                        className="form-control"
                                        validators={{
                                            required, minLength: minLength(3), maxLength: maxLength(15)
                                        }}
                                         />
                                    <Errors
                                        className="text-danger"
                                        model=".name"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                     />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="comments" md={12}>Comments</Label>
                                <Col md={12}>
                                    <Control.textarea model=".comment" id="comment" name="comment"
                                        rows="6"                                        
                                        className="form-control" />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col md={12}>
                                    <Button type="submit" color="primary">
                                    Submit
                                    </Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}
  function RenderDish({dish}) {
    if (dish != null)
      return (
        <FadeTransform
          in
          transformProps={{
              exitTransform: 'scale(0.5) translateY(-50%)'
          }}>
          <Card>
              <CardImg top src={baseUrl + dish.image} alt={dish.name} />
              <CardBody>
                  <CardTitle>{dish.name}</CardTitle>
                  <CardText>{dish.description}</CardText>
              </CardBody>
          </Card>
        </FadeTransform>
      );
    else return <div></div>;
  }

  function RenderComments({comments, addComment, dishId}) {
    if (comments == null) {
      return <div></div>;
    }
    //Traversing through all the comments
    const cmnts = comments.slice(0,4).map((comment) => {
      return (
        <li key={comment.id}>
          <h5 style={{fontFamily: 'math'}}>" {comment.comment} "</h5>
          <h6 style={{ fontFamily: 'math', letterSpacing : '1px'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          --  {comment.author} ,&nbsp;&nbsp;&nbsp;{new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "2-digit",
            }).format(new Date(comment.date))}
          </h6>
          <br></br>
        </li>
      );
    });
    return (
      <div className="col-12 ">
        <br></br>
        <h4 style={{fontFamily: 'math'}}> Comments </h4><br></br>
        <ul className="list-unstyled">{cmnts}</ul>
        <CommentForm  dishId={dishId} addComment={addComment} />
      </div>
    );
  }

  const  DishDetail = (props) => {
    const dish = props.dish;
    if (dish == null) {
      return <div></div>;
    }
    if (props.isLoading) {
      return(
          <div className="container">
              <div className="row">            
                  <Loading />
              </div>
          </div>
      );
    }
    else if (props.errMess) {
      return(
          <div className="container">
              <div className="row">            
                  <h4>{props.errMess}</h4>
              </div>
          </div>
      );
    }
    else if (props.dish != null) {
      return (
        <div style={{backgroundColor: '#bbc1f073', padding: '60px 0px'}}>
          <div className="container">
            <div className="row">
              <Breadcrumb>
                <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
              </Breadcrumb>
              <div className="col-12">
                <h3>{props.dish.name}</h3>
                <hr />
              </div>                
            </div>
            <div className="row">
              <div className="col-12 col-md-5 m-1">
                <RenderDish dish={props.dish} />
              </div>

              <div className="col-12 col-md-5 m-1">
                <div className="row" style={{ }}>
                <RenderComments comments={props.comments}
                  addComment={props.addComment}
                  dishId={props.dish.id}
                />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

export default DishDetail;