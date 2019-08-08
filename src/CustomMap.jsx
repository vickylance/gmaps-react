import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import styled from '@emotion/styled'

// import images
import SearchIcon from './assets/img/search.svg';
import CloseIcon from './assets/img/close-btn-mobile.svg';
import HotspotIcon from './assets/img/pin-hs-location.svg';
import RechargeIcon from './assets/img/pin-recharge-shop.svg';

const CustomMapStyled = styled.div`
  height: 100vh;
  width: 100vw;
`;

const SearchBoxStyled = styled.input`
  display: block;
  box-sizing: border-box;
  margin-top: 76px;
  margin-left: 8px;
  width: 344px;
  height: 48px;
  border: none;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(32, 55, 95, 0.32);
  background-color: #fff;
  outline: none;
  &::placeholder {
    font-family: "Roboto";
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 2;
    letter-spacing: normal;
    color: #1c1e21;
  }
  /* Text styling */
  font-family: "Roboto";
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 2;
  letter-spacing: normal;
  color: #1c1e21;
  padding-left: 16px;
  padding-right: 48px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const SearchBoxImgStyled = styled.img`
  position: absolute;
  top: 91px;
  left: 317px;
  z-index: 100;
  width: ${props => props.size + 'px'};
  height: ${props => props.size + 'px'};
  cursor: pointer;
`;

// const SearchBoxContainerStyled = styled.div`
//   display: flex;
//   position: absolute;
//   top: 76px;
//   left: 8px;
// `;

const SearchBox = ({ searchRef }) => {
  const [typed, setTyped] = useState(false);
  console.log('SearchBox rerender: ', typed);

  const checkSearchBox = useCallback(() => {
    if(searchRef.current.value !== '') {
      setTyped(true);
    } else {
      setTyped(false);
    }
  }, [searchRef]);

  const clearSearchBox = () => {
    if(typed) {
      searchRef.current.value = ''
      setTyped(false);
    }
  }

  useEffect(() => {
    let searchBox = searchRef.current;
    searchBox.addEventListener('keyup', checkSearchBox);
    searchBox.addEventListener('focus', checkSearchBox);
    return () => {
      searchBox.removeEventListener('keydown', checkSearchBox);
      searchBox.removeEventListener('focus', checkSearchBox);
    }
  }, [checkSearchBox, searchRef, typed]);

  console.log("yolo")
  return (
    <div>
      <SearchBoxStyled id="pac-input" ref={searchRef} className="controls" type="text" placeholder="Search Box" />
      <SearchBoxImgStyled onClick={clearSearchBox} size={typed ? 20 : 20} id="yolo" src={typed ? CloseIcon : SearchIcon} alt="search" />
    </div>
  )
}

export default function CustomMap() {
  const [map, setMap] = useState(null)
  const mapRef = useRef(null)
  const searchRef = useRef(null)

  const initMap = useCallback(() => {
    // The location of Uluru
    if (!map) {
      setMap(new window.google.maps.Map(mapRef.current, {
        center: {lat: -33.8688, lng: 151.2195},
        zoom: 8,
        disableDefaultUI: true
      }));
      return;
    }

    // Create the search box and link it to the UI element.
    let input = searchRef.current;
    let searchBox = new window.google.maps.places.SearchBox(input);
    console.log('searchBox: ', searchBox);
    map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    let markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      let places = searchBox.getPlaces();
      console.log(places);
      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      let bounds = new window.google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        let hotspotIcon = {
          url: HotspotIcon,
          size: new window.google.maps.Size(32, 40),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(16, 40),
          scaledSize: new window.google.maps.Size(32, 40),
        };

        console.log(HotspotIcon, 'place.icon');

        // Create a marker for each place.
        markers.push(new window.google.maps.Marker({
          map: map,
          icon: hotspotIcon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  }, [map]);

  useEffect(() => {
    initMap()
    console.log('initMap')
  }, [initMap])

  return (
    <>
      <SearchBox searchRef={searchRef}></SearchBox>
      <CustomMapStyled ref={mapRef}>
      </CustomMapStyled>
    </>
  )
}
