import React from 'react';

class SidebarContent extends React.Component {
    constructor() {
        super();
        this.state = {
            }
    }
    
    
    componentDidMount() {
    }

    render() {
        return (
        	<div>
        		<form className="custom-form">
        			<div className="form-row custom-padding">Якщо вас зацікавила вакансія, залиште ваші контактні дані для зворотного зв'язку
        			</div>
  					<div className="form-row">
    					<div className="form-group col-md-6">
      						<input type="email" className="form-control" id="inputEmail4" placeholder="Ім'я"/>
    					</div>
    					<div className="form-group col-md-6">
      						<input type="password" className="form-control" id="inputPassword4" placeholder="Фамілія"/>
    					</div>
  					</div>
  					<div className="form-group">
    					<input type="text" className="form-control" id="inputAddress" placeholder="Контактний телефон"/>
  					</div>
					<div class="custom-file">
  					<input type="file" class="custom-file-input" id="customFile"/>
  					<label class="custom-file-label" for="customFile">Додати резюме</label>
					</div>
  					<button className="btn btn-primary">Відіслати</button>
				</form>
  			</div>
        );
    }
}

export default SidebarContent;
