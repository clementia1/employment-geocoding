import React from 'react';
import Sidebar from "react-sidebar";
import SidebarContent from "./SidebarContent.js";
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
                data: [],
                sidebarOpen: false
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

  	onSetSidebarOpen = (open) => {
    	this.setState({ sidebarOpen: !this.state.sidebarOpen });
  	}

    render() {
    	const position = [50.0020973, 36.2508555889877];
    	
        return (
        	<div className='container-fluid'>
        		<div className='map'>
        			<div className="row justify-content-center">
        			<div >
        				      <Sidebar
        				      		sidebar={<SidebarContent/>}
        							open={this.state.sidebarOpen}
        							onSetOpen={this.onSetSidebarOpen}
        							styles={{ sidebar: { background: "white", zIndex: 9999, width: '400px' } }} >
      						  </Sidebar>
      				</div>
        			<div className="col-12">
    					  					<Map maxZoom={19} center={position} zoom={13}>    					  						
        										<TileLayer
          										attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          										url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        										/>
        										{
        											this.state.data.map(item => {        											
        												let position = [item.latitude, item.longitude]
        												return <Marker position={position}><Popup>{item['Посада (назва) / Характеристика вакансії']}<br/>{item['Роботодавець (назва) / Оперативні вакансії']}<br/>{item['Заробітна плата / Оперативні вакансії']+' грн'}<br/>{item["Завдання та обов'язки / Характеристика вакансії"]}<br/><br/><button type="button" className="btn btn-outline-info btn-block" onClick={() => this.onSetSidebarOpen(true)}>Мені цікаво</button></Popup></Marker>
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
