import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

class App extends React.Component {
    constructor() {
        super();
    }

    render() {
    	const position = [50.0020973, 36.2508555889877]
        return (
        	<div className='container-fluid'>
        		<div className='map'>
        			<div className="col-4">
    					  					<Map center={position} zoom={13}>
        										<TileLayer
          										attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          										url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        										/>
    											<Marker position={position}>
      											<Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
    											</Marker>
  											</Map>
  					</div>
  				</div>
  			</div>
        );
    }
}

export default App;
