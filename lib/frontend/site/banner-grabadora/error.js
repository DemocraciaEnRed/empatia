import React, { Component } from 'react'

class Error extends Component {
  render () {
    return (
      <div className='text-center'>
        <p>
          <i className='fas fa-xmark fa-3x' />
        </p>
        <p className='text-danger is-size-5 mb-2'>
          Ocurrió un error
        </p>
        <p className='text-danger'>
          Por favor, vuelva a intentarlo más tarde
        </p>
      </div>
    )
  }
}

export default Error
