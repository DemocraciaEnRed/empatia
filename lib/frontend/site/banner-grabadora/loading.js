import React, { Component } from 'react'

class Loading extends Component {
  render () {
    return (
      <div className='my-5'>
        <p><i className='fa-solid fa-3x fa-spin fa-sync' /></p>
        <p className='is-size-5' style={{ letterSpacing: '5px' }}>Cargando</p>
      </div>
    )
  }
}

export default Loading
