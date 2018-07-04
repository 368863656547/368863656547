import React, { PropTypes, Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { FlatButton } from 'material-ui';
import Input from '../Input';
import './styles.css';
import validate from './validate.js';
import { TextField } from 'redux-form-material-ui'

class CreateUserForm extends Component {

  renderCreateUser() {
    const header = 'Create your user ID'
    return (
      <div>
        <div className='createFormHeader'>
          {header}
        </div>
        <div className='createFormRow'>
          <div>
            <Field
              name="username"
              component={TextField}
              hintText="Choose a user ID"
            />
          </div>
          <div>
            <Field
              type="password"
              name="password"
              component={TextField}
              hintText="Choose a password"
            />
          </div>
        </div>
      </div>
    );
  }

  renderButtons() {
    const { handleSubmit } = this.props
    const labelStyles = {
      textTransform: 'none',
      fontFamily: 'Open Sans',
      fontWeight: 600,
    };
    const styles = {
      color: '#fff',
      backgroundColor: '#099CEC',
    };

    return (
      <div className='createFormButton'>
        <FlatButton
          label="Sign up"
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
    } = this.props;

    return (
      <div className='createFormContent'>
        <form onSubmit={handleSubmit}>
          {this.renderCreateUser()}
          {this.renderButtons()}
        </form>
      </div>
    );
  }
}

CreateUserForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default CreateUserForm = reduxForm({
  form: 'createUserForm',
  validate,
})(CreateUserForm);
