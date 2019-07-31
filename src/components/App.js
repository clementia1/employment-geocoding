import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
                data: []
            }
    }
    
    
    componentDidMount() {    	
    	fetch('./jsonData.json')
    	  .then(response => { return response.json() })
  			.then(jsonData => {  				
    			this.setState({
                    data: jsonData
                });
                console.log(jsonData);
  			})
    }

    render() {
    	const position = [50.0020973, 36.2508555889877]
        return (
        	<div className='container-fluid'>
        		<div className='map'>
        			<div className="row justify-content-center">
        			<div className="col-12">
    					  					<Map maxZoom={19} center={position} zoom={13}>    					  						
        										<TileLayer
          										attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          										url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        										/>
        										{
        											this.state.data.map(item => {        											
        												let position = [item.latitude, item.longitude]
        												return <Marker position={position}><Popup>{item['Посада (назва) / Характеристика вакансії']}<br/>{item['Роботодавець (назва) / Оперативні вакансії']}<br/>{item['Заробітна плата / Оперативні вакансії']+' грн'}<br/>{item["Завдання та обов'язки / Характеристика вакансії"]}<br/></Popup></Marker>
        											})
        										}
  											</Map>
  						</div>
  					</div>
  				</div>
  			</div>
        );
    }
}

export default App;
