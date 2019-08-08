import React, { Component } from 'react';

const { compose } = require('recompose');
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
} = require('react-google-maps');
const { MarkerWithLabel } = require('react-google-maps/lib/components/addons/MarkerWithLabel');

const MapWithAMarkerWithLabel = compose(
  withScriptjs,
  withGoogleMap,
)(props => (
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
  >
    <MarkerWithLabel
      position={{ lat: -34.397, lng: 150.644 }}
      labelAnchor={new google.maps.Point(0, 0)}
      labelStyle={{ backgroundColor: 'yellow', fontSize: '32px', padding: '16px' }}
    >
      <div>Hello There!</div>
    </MarkerWithLabel>
  </GoogleMap>
));

export default MapWithAMarkerWithLabel;
