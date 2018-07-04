import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { Field, reduxForm } from 'redux-form';
import { FlatButton } from 'material-ui';
import Input from '../../components/Input';
import './styles.css';
import { TextField } from 'redux-form-material-ui'

class CustomerInfoForm extends Component {

  renderCredit() {
    return (
      <div>
        <div className='infoHeader'>Credit Card Information</div>
        <div className='infoRow'>
          <div>
            <Field
              name="firstName"
              component={TextField}
              hintText="First Name"
            />
          </div>
          <div>
            <Field
              name="lastName"
              component={TextField}
              hintText="Last Name"
            />
          </div>
        </div>
        <div className='infoRow'>
          <div>
            <Field
              name="cardNumber"
              component={TextField}
              hintText="Card Number"
            />
          </div>
          <div>
            <Field
              name="cvv"
              component={TextField}
              hintText="CVV"
            />
          </div>
        </div>
        <div className='infoRow'>
          <Field
            name="expirationDate"
            component={TextField}
            hintText="MM/YY"
          />
        </div>
      </div>
    );
  }

  renderBilling() {
    return (
      <div>
        <div className='infoHeader'>Billing Information</div>
        <div className='infoRow'>
          <div>
            <Field
              name="company"
              component={TextField}
              hintText="Company"
            />
          </div>
          <div>
            <Field
              name="title"
              component={TextField}
              hintText="Title"
            />
          </div>
        </div>
        <div className='infoRow'>
          <div>
            <Field
              name="address"
              component={TextField}
              hintText="Address"
            />
          </div>
          <div>
            <Field
              name="city"
              component={TextField}
              hintText="City"
            />
          </div>
        </div>
      </div>
    );
  }

  renderButtons() {
    const labelStyles = {
      textTransform: 'none',
      fontFamily: 'Open Sans',
      fontWeight: 600,
    };
    return (
      <div className='infoButton'>
        <FlatButton
          label="Continue Shopping"
          containerElement={<Link to="/" />}
          style={{
            color: '#099CEC',
          }}
          labelStyle={labelStyles}
        />
        <FlatButton
          label="Complete Order"
          type="submit"
          style={{
            color: '#fff',
            backgroundColor: '#099CEC',
          }}
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
    const err = error ? <span className='loginErrorMessage'>{error}</span> : null

    return (
      <div className="infoSection">
        <form onSubmit={handleSubmit}>
          {this.renderCredit()}
          {this.renderBilling()}
          {err}
          {this.renderButtons()}
        </form>
      </div>
    );
  }
}

CustomerInfoForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default CustomerInfoForm = reduxForm({
  form: 'customerInfo',
})(CustomerInfoForm);
