import React from "react";

const _ = require("lodash");
const { compose, withProps, withHandlers, lifecycle } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} = require("react-google-maps");
const {
  SearchBox
} = require("react-google-maps/lib/components/places/SearchBox");
const {
  MarkerClusterer
} = require("react-google-maps/lib/components/addons/MarkerClusterer");
const {
  MarkerWithLabel
} = require("react-google-maps/lib/components/addons/MarkerWithLabel");
const dummyMethod = (lat, long) => {
  window.open(`http://maps.google.com/maps?daddr=${lat},${long}`);
};

const MapWithAMarkerClusterer = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCS8MVjv3gobxEJEWV1xMqZ10Wb2EYEWAQ&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: "100%" }} />,
    containerElement: <div style={{ height: "100vh" }} />,
    mapElement: <div style={{ height: "100%" }} />
  }),
  withHandlers({
    onMarkerClustererClick: () => markerClusterer => {
      const clickedMarkers = markerClusterer.getMarkers();
      console.log(`Current clicked markers length: ${clickedMarkers.length}`);
      console.log(clickedMarkers);
    }
  }),
  lifecycle({
    componentWillMount() {
      const refs = {};
      this.setState({
        bounds: null,
        center: {
          lat: 41.9,
          lng: -87.624
        },
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter()
          });
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new window.google.maps.LatLngBounds();
          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location
          }));
          const nextCenter = _.get(
            nextMarkers,
            "0.position",
            this.state.center
          );
          console.log("nextCenter", nextCenter);
          console.log("nextMarkers", nextMarkers);
          this.setState({
            center: nextCenter,
            markers: nextMarkers
          });
          refs.map.fitBounds(bounds);
        }
      });
    },
    componentDidMount() {
      fetch(
        "https://gist.githubusercontent.com/farrrr/dfda7dd7fccfec5474d3/raw/758852bbc1979f6c4522ab4e92d1c92cba8fb0dc/data.json"
      )
        .then(res => res.json())
        .then(data => {
          this.setState({ markers: data.photos });
        });
    }
  }),
  withScriptjs,
  withGoogleMap
)(props => {
  // console.log("props", props);
  // console.log(
  //   "google.maps.ControlPosition.TOP_LEFT",
  //   window.google.maps.ControlPosition.TOP_LEFT
  // );
  // let lat;
  // let long;
  // if (props) {
  //   console.log("props", props.center);
  // }
  // if (typeof props.center.lat === "function") {
  //   lat = props.center.lat();
  //   long = props.center.lng();
  // }
  return (
    <GoogleMap
      defaultZoom={3}
      defaultCenter={{ lat: 25.0391667, lng: 121.525 }}
      ref={props.onMapMounted}
      onBoundsChanged={props.onBoundsChanged}
    >
      <SearchBox
        ref={props.onSearchBoxMounted}
        bounds={props.bounds}
        controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
        onPlacesChanged={props.onPlacesChanged}
      >
        <input
          type="text"
          placeholder="Customized your placeholder"
          style={{
            boxSizing: "border-box",
            border: "1px solid transparent",
            width: "240px",
            height: "32px",
            marginTop: "27px",
            padding: "0 12px",
            borderRadius: "3px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
            fontSize: "14px",
            outline: "none",
            textOverflow: "ellipses"
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
      {/* {props.markers.map((marker, index) => (
        <>
          <Marker key={index} position={marker.position} />
          <MarkerWithLabel
            position={marker.position}
            labelAnchor={new window.google.maps.Point(0, 0)}
            labelStyle={{
              backgroundColor: "#54b8a7",
              borderRadius: "0px",
              fontSize: "16px",
              padding: "10px"
            }}
            onClick={() => dummyMethod(lat, long)}
          >
            <div>Get Directions</div>
          </MarkerWithLabel>
        </>
      ))} */}
    </GoogleMap>
  );
});
export default MapWithAMarkerClusterer;
