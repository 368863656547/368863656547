import React, { PropTypes, Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { FlatButton } from 'material-ui';
import './styles.css';
import validate from './validate.js'
import { TextField } from 'redux-form-material-ui'

class LoginForm extends Component {

  renderLogin() {
    return (
      <div>
        <div className='loginFormHeader'>Sign in to your account</div>
        <div className='loginFormRow'>
          <div>
            <Field
              name="username"
              component={TextField}
              hintText="Username"
            />
          </div>
          <div>
            <Field
              type="password"
              name="password"
              component={TextField}
              hintText="Password"
            />
          </div>
        </div>
      </div>
    );
  }

  renderButtons() {
    const { handleSubmit } = this.props
    const styles = {
      color: '#fff',
      backgroundColor: '#099CEC',
    };
    const labelStyles = {
      textTransform: 'none',
      fontFamily: 'Open Sans',
      fontWeight: 600,
    };

    return (
      <div className='loginFormButton'>
        <FlatButton
          label="Sign in"
          onClick={handleSubmit}
          style={styles}
          labelStyle={labelStyles}
        />
      </div>
    );
  }

  render() {
    const {
      handleSubmit,
      error,
    } = this.props;

    const err = error ? <span className='errorMessage'>{error}</span> : null

    return (
      <div className='loginFormContent'>
        <form onSubmit={handleSubmit}>
          {this.renderLogin()}
          {err}
          {this.renderButtons()}
        </form>
      </div>
    );
  }
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default LoginForm = reduxForm({
  form: 'loginForm',
  touchOnBlur: false,
  touchOnChange: true,
  validate,
})(LoginForm);
