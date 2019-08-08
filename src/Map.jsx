import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

class Map extends Component {
  render() {
    const GoogleMapExample = withGoogleMap(props => (
      <GoogleMap
        defaultCenter={{ lat: 13.08, lng: 80.27 }}
        defaultZoom={13}
      >
        <Marker position={{ lat: 13.08, lng: 80.27 }} />
      </GoogleMap>
    ));
    return (
      <div>
        <GoogleMapExample
          containerElement={<div style={{ height: '500px', width: '500px' }} />}
          mapElement={<div style={{ height: '100%' }} />}
        />
      </div>
    );
  }
}
export default Map;
