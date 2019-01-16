import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export default class Touchable extends PureComponent {
  static propTypes = {
    feedback: PropTypes.bool,
  };

  static defaultProps = {
    feedback: false,
  };

  render() {
    const { feedback, children, style, pointerEvents, ...props } = this.props;
    const Button = feedback ? TouchableOpacity : TouchableWithoutFeedback;
    const buttonStyle = feedback ? style : {};
    // If touchable w/o feedback, must have only one child, wrap children in view
    // and give style to view
    return (
      <Button {...props} style={buttonStyle}>
        {feedback ? children : <View style={style} pointerEvents={pointerEvents}>{children}</View>}
      </Button>
    );
  }
}
