import React ,{Component} from 'react';
import propTypes from 'prop-types'


class InputField extends Component{
      
    render(){
        const { className,label,type, input, placeholder, disabled , meta: { touched, error, warning }  } = this.props;
        return(
            <div>
                <label>
                     {label}
                </label>
                <div>
                    <input {...input}  type={type} placeholder={placeholder}  className={className} disabled={disabled} />
                    {touched &&
                        ((error &&
                        <span style={{color:'red'}}>
                            {error}
                        </span>) ||
                    (warning &&
                        <span>
                        {warning}
                        </span>))}
                </div>
          </div>
        )
    }
}

InputField.propTypes = {
    className: propTypes.string.isRequired,
    placeholder: propTypes.string.isRequired,
    disabled: propTypes.bool,
}
InputField.defaultProps = {
    disabled: false
}
export default InputField;