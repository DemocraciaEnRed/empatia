import React, { Component } from 'react'
import { Link } from 'react-router'

class Step02 extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dni: '',
      fullname: ''
    }
    this.submitMetadata = this.submitMetadata.bind(this)
  }

  componentDidMount () {
    this.props.scrollToGrabadora()
  }

  handleDniChange = (e) => {
    this.setState({ dni: e.target.value })
  }
  handleFullnameChange = (e) => {
    this.setState({ fullname: e.target.value })
  }

  submitMetadata = () => {
    this.props.setFirstData(this.state.dni, this.state.fullname)
    this.props.goToStep(3)
  }

  render () {
    let { dni, fullname } = this.state
    return (
      <div>
<div className="step-title-container my-3">ANTES DE COMENZAR</div>
        <p className='subtitle'>Primero necesitamos que ingreses tu Nombre y Apellido y DNI</p>
        <div className='row'>
          <div className='col-md-4 offset-md-2'>
            <div className='form-group text-left'>
              <label htmlFor='contact' className='is-size-6'><b>Nombre y Apellido</b></label>
              <input type='text' className='form-control form-control-lg' id='fullName' placeholder='Nombre y apellido' onChange={this.handleFullnameChange} style={{ border: '1px solid #000', borderRadius: '5px' }} />
            </div>
          </div>
          <div className='col-md-4'>
            <div className='form-group text-left'>
              <label htmlFor='contact' className='is-size-6'><b>Nro. de Documento</b></label>
              <input type='text' className='form-control form-control-lg' id='dni' placeholder='Nro. de Documento' onChange={this.handleDniChange} style={{ border: '1px solid #000', borderRadius: '5px' }} />
            </div>
          </div>
        </div>
        <button className='btn btn-primary mt-3' disabled={dni.length < 5 || fullname.length < 5} onClick={this.submitMetadata}>SIGUIENTE <i className='fas fa-arrow-right' /></button>
      </div>
    )
  }
}

export default Step02
