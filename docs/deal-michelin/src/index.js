import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

import ReactTable from 'react-table'

export class MapContainer extends React.Component {
render() {
    return (
      <Map google={this.props.google} zoom={14}>

        <Marker onClick={this.onMarkerClick}
                name={'Current location'} />

        <InfoWindow onClose={this.onInfoWindowClose}>
            <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyAtmBBgB5ebIT98Xf1a3DNTzOl-9_uU-kg")
})(MapContainer)
