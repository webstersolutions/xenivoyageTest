import React ,{Component} from 'react';

class CheckField extends Component{

render(){
    const { input: { value, ...additionalInput }, label, meta: { touched, error, warning } } = this.props;
    return(
        <React.Fragment>
            
            <input type="checkbox" className="filtercheckbox" checked={value} {...additionalInput} id="checkA8" name={label} />
            <label htmlFor="checkA8">
                {label}
            </label>
             <br />
            {touched &&
                ((error &&
                <span style={{color:'red'}}>
                    {error}
                </span>) ||
            (warning &&
                <span>
                {warning}
                </span>))}
                    
        </React.Fragment>
    )
}}

CheckField.defaultProps = {
    className: '',
    value: false,
    label: null,
    id:''
}

export default CheckField;
