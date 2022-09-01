import React, { Component } from 'react'
import 'whatwg-fetch'

export default class AdminUsuarios extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div className='admin-usuarios'>
        <h2>Audios</h2>
        <hr />
        <div className='clearfix'>
          <div className='pull-left'>
            <p className='h4'><i className="fas fa-file-arrow-down"></i>  Descargar listado</p>
            <p>Descarge en una planilla los usuarios registrados en la plataforma</p>
          </div>
          <div className='pull-right'>
            <a href='/api/v2/users/all/csv'
              download
              className='btn btn-primary'>
              Descargar CSV
            </a>
          </div>
        </div>
      </div>
    )
  }
}