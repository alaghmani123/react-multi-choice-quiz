import React, { Component } from 'react'
// import './Questionnaire.css'

class Questionnaire extends Component {
  render() {
    if (this.props.user != null) {
      return (
        <div>
          <h4>{this.props.user.email}</h4>
          <h4>Is Logged In</h4>
        </div>
      )
    } else {
      return (
        <div>
        </div>
      )
    }
  }

}

export default Questionnaire
