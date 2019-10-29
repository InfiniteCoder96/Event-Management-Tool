import React, {Component} from 'react';
import L from 'leaflet';
import Joi from '@hapi/joi';

import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { Alert, Card, Button, Form, FormGroup, Label, Input, CardTitle, CardText } from 'reactstrap';
import './App.css';
import loading from './Infinity.svg';
import myLocationIconUrl from './myLocation.svg';
import usersLocationsIconUrl from './usersLocations.svg';

var myIcon = L.icon({
  iconUrl: myLocationIconUrl,
  iconSize: [50, 82],
  iconAnchor: [25, 82],
  popupAnchor: [0, -41]
});

var usersIcons = L.icon({
  iconUrl: usersLocationsIconUrl,
  iconSize: [50, 82],
  iconAnchor: [25, 82],
  popupAnchor: [0, -82]
});

const schema = Joi.object().keys({
  name: Joi.string().min(3).max(30).required(),
  message: Joi.string().min(3).max(30).required()
});

const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api/v1/messages' : 'https://guestmapapi.inofinitylabs.com/api/v1/messages';

class App extends Component {
  state = {
    location : {
      lat: 7.86,
      lng: 80.65167
    },
    haveUsersLocation: false,
    zoom: 8,
    userMessage: {
      name: '',
      message: ''
    },
    sendingMessage: false,
    sentMessage: false,
    messages: [],
    isUserOnMobile: false,
    messageBoxOpen: false
  }

  componentDidMount(){

    window.addEventListener("resize", this.resize.bind(this));
    this.resize();

    fetch('https://cors-anywhere.herokuapp.com/' + API_URL,{
      
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
    .then(res => res.json())
    .then(messages => {

      const haveSeenLocation = {};

      messages = messages.reduce((all, message) => {

        const key = `${message.latitude}${message.longitude}`;

        if(haveSeenLocation[key]){
          haveSeenLocation[key].otherMessages = haveSeenLocation[key].otherMessages || [];
          haveSeenLocation[key].otherMessages.push(message);
            
        }
        else{
          haveSeenLocation[key] = message;
          all.push(message);
        }

        return all;
      }, []);

        this.setState({
          messages       
        });
      })
      .catch(function () {
        console.log("Promise Rejected");
      });

    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        haveUsersLocation: true,
        zoom: 13
        
      });

      console.log(position);
    }, () => {
      console.log("Oops.. location not supported");
      fetch('https://ipapi.co/json')
      .then(res => res.json())
      .then(_location => {
       
        this.setState({
          location: {
            lat: _location.latitude,
            lng: _location.longitude
          },
          haveUsersLocation: true,
          zoom: 13
          
        });
      })
      .catch(function () {
        console.log("Promise Rejected");
      });
    })
  }

  resize() {
    let currentlyOnMobile = (window.innerWidth <= 760);
    if (currentlyOnMobile !== this.state.isUserOnMobile) {
        this.setState({isUserOnMobile: currentlyOnMobile});
    }
  }

  _showMessageBox = () => {
    this.setState({
      messageBoxOpen: true
    });
  }

  formIsValid = () => {
    const userMessage = {
      name: this.state.userMessage.name,
      message: this.state.userMessage.message
    };

    const result = Joi.validate(userMessage, schema);

    return !result.error && this.state.haveUsersLocation ? true : false;
  }

  formSubmitted = (event) => {
    event.preventDefault();

    if(this.formIsValid()){

      this.setState({
         sendingMessage: true 
      });

      fetch('https://cors-anywhere.herokuapp.com/' + API_URL, {
        
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          name: this.state.userMessage.name,
          message: this.state.userMessage.message,
          latitude: this.state.location.lat,
          longitude: this.state.location.lng
        })
        
      })
      .then(res => res.json())
      .then(message => {
        console.log(message);

        setTimeout(() => {
          this.setState({
            sendingMessage: false,
            sentMessage: true,
            messageBoxOpen: false
          })
        }, 4000);
        
      })
      .catch(function () {
        console.log("Promise Rejected");
      });
        
    }

  }

  valueChanged = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
        
        userMessage:{
          ...prevState.userMessage,
          [name] : value
        }
      
    }))
  }

  render(){

    const position = [this.state.location.lat, this.state.location.lng]

    return (
      <div className="map">
        <Map className="map" center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          { this.state.haveUsersLocation ?
            <Marker 
              position={position}
              icon={myIcon}>
              
            </Marker>

            : ''
          }

          {this.state.messages.map(message => (
            <Marker 
              key={message._id}
              position={[message.latitude, message.longitude]}
              icon={usersIcons}>
              <Popup>
                <p><em>{message.name}:</em> {message.message}</p>
                {message.otherMessages  ? 
                  message.otherMessages.map(message => <p key={message._id}><em>{message.name}:</em> {message.message}</p>) : ''}
              </Popup>
            </Marker>
          ))}
          
        </Map>

        { this.state.isUserOnMobile && !this.state.messageBoxOpen ?
          <Button className="message-btn" type="button" color="danger" onClick={this._showMessageBox}>Send a message</Button>

            : 

            <Card body inverse className="message-form">
            <CardTitle>Welcome to Inofinity Labs GuestM.app !</CardTitle>
            <CardText>Leave a message with your location...</CardText>
            
            { !this.state.sendingMessage && !this.state.sentMessage && this.state.haveUsersLocation ? 
            <Form onSubmit={this.formSubmitted}>
              <FormGroup>
                <Label for="Name">Name</Label>
                <Input 
                  onChange={this.valueChanged}
                  type="text" 
                  name="name" 
                  id="name" 
                  placeholder="Enter your name" />
              </FormGroup>
              <FormGroup>
                <Label for="Message">Message</Label>
                <Input 
                  onChange={this.valueChanged}
                  type="textarea" 
                  name="message" 
                  id="message" 
                  placeholder="Enter a message" />
              </FormGroup>
              <Button type="submit" color="info" block disabled={!this.formIsValid()}>Send</Button>
            </Form>
            :
            this.state.sendingMessage || !this.state.haveUsersLocation ?
              <img src={loading} alt="Loading..."/>
              : <Alert color="success">Success ! Thanks for your support</Alert>
            }
          </Card>
        }
        
      </div>
    );
  }
  
}

export default App;
