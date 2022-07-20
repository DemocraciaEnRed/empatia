import React, { Component } from 'react'
// import { Link } from 'react-router'

class Step05 extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount () {
    this.props.scrollToGrabadora()
  }

  render () {
    return (
      <div>
        {/* <p className='text-primary'><i className='fa-solid fa-3x fa-thumbs-up' /></p> */}
        <div className="step-title-container my-3">¡TU IDEA FUE ENVIADA CON EXITO!</div>
        <div className='row mt-4'>
          <div className='col-md-8 offset-md-2'>
            <p className=''>Muchas gracias por participar, estaremos escuchandola y te contactaremos para contarte como la llevaremos adelante</p>
            <div className="ok-container mt-4">
              <img src='/lib/frontend/site/home-multiforum/ok.svg'/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Step05
