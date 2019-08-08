import React, { Component, Fragment } from 'react';

const _ = require('lodash');
const { compose, withProps, lifecycle } = require('recompose');
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} = require('react-google-maps');
const { SearchBox } = require('react-google-maps/lib/components/places/SearchBox');
const { MarkerWithLabel } = require('react-google-maps/lib/components/addons/MarkerWithLabel');

const dummyMethod = (lat, long) => { window.open(`http://maps.google.com/maps?daddr=${lat},${long}`); };

const MapWithASearchBox = compose(
  withProps({
    googleMapURL: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCS8MVjv3gobxEJEWV1xMqZ10Wb2EYEWAQ&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '400px' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {};
      this.setState({
        bounds: null,
        center: {
          lat: 41.9, lng: -87.624,
        },
        markers: [],
        onMapMounted: (ref) => {
          console.log('onMapMounted');
          refs.map = ref;
        },
        onBoundsChanged: () => {
          console.log('onBoundsChanged');
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          });
        },
        onSearchBoxMounted: (ref) => {
          console.log('onSearchBoxMounted');
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          console.log('onPlacesChanged');
          const places = refs.searchBox.getPlaces();
          const bounds = new google.maps.LatLngBounds();
          places.forEach((place) => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);
          this.setState({
            center: nextCenter,
            markers: nextMarkers,
          });
          refs.map.fitBounds(bounds);
        },
      });
    },
  }),
  withScriptjs,
  withGoogleMap,
)((props) => {
  let lat;
  let long;
  if (props) {
    console.log('props', props.center);
  }
  if (typeof props.center.lat === 'function') {
    console.log('props function', props.center.lat());
    lat = props.center.lat();
    long = props.center.lng();
  }
  return (
    <div style={{ height: '500px', width: '500px' }}>
      <GoogleMap
        ref={props.onMapMounted}
        defaultZoom={15}
        center={props.center}
        onBoundsChanged={props.onBoundsChanged}
      >
        <SearchBox
        ref={props.onSearchBoxMounted}
        bounds={props.bounds}
        controlPosition={google.maps.ControlPosition.TOP_LEFT}
        onPlacesChanged={props.onPlacesChanged}
      >
        <input
          type="text"
          placeholder="Customized your placeholder"
          style={{
            boxSizing: 'border-box',
            border: '1px solid transparent',
            width: '240px',
            height: '32px',
            marginTop: '27px',
            padding: '0 12px',
            borderRadius: '3px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
            fontSize: '14px',
            outline: 'none',
            textOverflow: 'ellipses',
          }}
        />
      </SearchBox>
        {props.markers.map((marker, index) => (
        <Fragment>
          <Marker key={index} position={marker.position} />
          <MarkerWithLabel
            position={marker.position}
            labelAnchor={new google.maps.Point(0, 0)}
            labelStyle={{
              backgroundColor: '#54b8a7', borderRadius: '0px', fontSize: '16px', padding: '10px',
            }}
            onClick={() => dummyMethod(lat, long)}
          >
            <div>Get Directions</div>
          </MarkerWithLabel>
        </Fragment>
      ))}

      </GoogleMap>
    </div>
  );
});
export default MapWithASearchBox;
