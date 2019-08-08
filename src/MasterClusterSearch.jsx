import React from 'react';

const fetch = require('isomorphic-fetch');
const _ = require('lodash');
const { compose, withProps, withHandlers } = require('recompose');
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} = require('react-google-maps');
const { MarkerClusterer } = require('react-google-maps/lib/components/addons/MarkerClusterer');
const { SearchBox } = require('react-google-maps/lib/components/places/SearchBox');

const MapWithAMarkerClustererSearch = compose(
  withProps({
    googleMapURL: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCS8MVjv3gobxEJEWV1xMqZ10Wb2EYEWAQ&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '400px' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers();
      console.log(`Current clicked markers length: ${clickedMarkers.length}`);
      console.log(clickedMarkers);
    },
  }),
  withScriptjs,
  withGoogleMap,
)(props => (
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={3}
    defaultCenter={{ lat: 25.0391667, lng: 121.525 }}
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
    <MarkerClusterer
      onClick={props.onMarkerClustererClick}
      averageCenter
      enableRetinaIcons
      gridSize={60}
    >
      {props.markers.map(marker => (
        <Marker
          key={marker.photo_id}
          position={{ lat: marker.latitude, lng: marker.longitude }}
        />
      ))}
    </MarkerClusterer>
  </GoogleMap>
));

export default class MarkerCluster extends React.PureComponent {
  componentWillMount() {
    this.refs = {};
    this.setState({
      bounds: null,
      center: {
        lat: 41.9, lng: -87.624,
      },
      markers: [],
    });
  }

      onMapMounted= (ref) => {
        console.log('onMapMounted');
        this.refs.map = ref;
      }

      onBoundsChanged= () => {
        console.log('onBoundsChanged');
        this.setState({
          bounds: this.refs.map.getBounds(),
          center: this.refs.map.getCenter(),
        });
      }

      onSearchBoxMounted= (ref) => {
        console.log('onSearchBoxMounted', ref);
        this.refs.searchBox = ref;
      }

      onPlacesChanged= () => {
        // console.log('this.refs', this.refs.searchBox.getPlaces());
        const places = this.refs.searchBox.getPlaces();
        const bounds = new google.maps.LatLngBounds();
        console.log('onPlacesChanged', places);
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
        console.log('nextMarkers', nextCenter);
        const nextCenter = _.get(nextMarkers, '0.position', this.state.center);
        console.log('nextCenter', nextCenter);
        // this.setState({
        //   center: nextCenter,
        //   markers: nextMarkers,
        // });
        // this.refs.map.fitBounds(bounds);
      }

      componentDidMount() {
        const url = [
          // Length issue
          'https://gist.githubusercontent.com',
          '/farrrr/dfda7dd7fccfec5474d3',
          '/raw/758852bbc1979f6c4522ab4e92d1c92cba8fb0dc/data.json',
        ].join('');
        fetch(url)
          .then(res => res.json())
          .then((data) => {
            this.setState({ markers: data.photos });
          });
      }

      render() {
        return (
          <MapWithAMarkerClustererSearch
            markers={this.state.markers}
            onPlacesChanged={this.onPlacesChanged}
            onSearchBoxMounted={this.onSearchBoxMounted}
            onBoundsChanged={this.onBoundsChanged}
            onMapMounted={this.onMapMounted}
          />
        );
      }
}
