import React, { PropTypes } from 'react';
import { TextField } from 'material-ui';

// const Input = ({ type, field, hintText }) => {
//   return (
//     <div>
//       <TextField
//         type={type}
//         hintText={hintText}
//         errorText={field.meta.touched && field.meta.error}
//         {...field.input}
//       />
//     </div>
//   );
// }

class Input extends React.Component {
  render() {
    const { type, field, hintText } = this.props;
    return (
      <div>
        <TextField
          type={type}
          hintText={hintText}
          errorText={field.meta.touched && field.meta.error}
          {...field.input}
        />
      </div>
    );
  }
}

Input.propTypes = {
  field: PropTypes.object.isRequired,
  hintText: PropTypes.string,
  type: PropTypes.string,
}

export default Input
