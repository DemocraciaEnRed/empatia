import React, { Component } from 'react'
import { Link } from 'react-router'

class Step04 extends Component {
  constructor (props) {
    super(props)
    this.state = {
      contact: '',
      email: '',
      location: '',
      province: '',
      scale: '',
      otherScale: '',
      about: ''
    }
    this.submitMetadata = this.submitMetadata.bind(this)
    this.handleContactChange = this.handleContactChange.bind(this)
    this.handleLocationChange = this.handleLocationChange.bind(this)
    this.handleProvinceChange = this.handleProvinceChange.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handleScaleChange = this.handleScaleChange.bind(this)
    this.handleOtherScaleChange = this.handleOtherScaleChange.bind(this)
    this.handleAboutChange = this.handleAboutChange.bind(this)
  }

  componentDidMount () {
    this.props.scrollToGrabadora()
  }

  handleContactChange = (e) => {
    this.setState({ contact: e.target.value })
  }
  handleLocationChange = (e) => {
    this.setState({ location: e.target.value })
  }
  handleProvinceChange = (e) => {
    this.setState({ province: e.target.value })
  }
  handleEmailChange = (e) => {
    this.setState({ email: e.target.value })
  }
  handleScaleChange = (e) => {
    this.setState({ scale: e.target.value })
  }
  handleOtherScaleChange = (e) => {
    this.setState({ otherScale: e.target.value })
  }
  handleAboutChange = (e) => {
    this.setState({ about: e.target.value })
  }
  submitMetadata = () => {
    let payload = {
      // contact: this.state.contact,
      // email: this.state.email,
      // location: this.state.location,
      // province: this.state.province,
      about: this.state.about
    }
    if (this.state.scale === 'Otro') {
      payload.scale = this.state.otherScale
    } else {
      payload.scale = this.state.scale
    }
    this.props.submitLastStep(payload)
  }

  render () {
    // let { dni, fullname } = this.state
    return (
      <div>
        <div className="step-title-container my-3">¡ÚLTIMO PASO!</div>
          <p className='subtitle'>Contanos más acerca de la propuesta y dejanos tus datos para que podamos contactarte</p>
          {/* <div className='row'>
            <div className='col-md-4 offset-md-2'>
              <div className='form-group text-left'>
                <label htmlFor='contact' className='is-size-6'><b>Nro. de Teléfono</b></label>
                <input type='text' className='form-control' id='contact' placeholder='Nro. de Telefono' onChange={this.handleContactChange} style={{ border: '1px solid #000', borderRadius: '5px' }} />
              </div>
            </div>
            <div className='col-md-4'>
              <div className='form-group text-left'>
                <label htmlFor='contact' className='is-size-6'><b>Email</b></label>
                <input type='email' className='form-control' id='email' placeholder='Email' onChange={this.handleEmailChange} style={{ border: '1px solid #000', borderRadius: '5px' }} />
              </div>
            </div>
          </div> */}
          {/* <div className='row'>
            <div className='col-md-4 offset-md-2'>
              <div className='form-group text-left'>
                <label htmlFor='contact' className='is-size-6'><b>Provincia</b></label>
                <select id="province" className="form-control" onChange={this.handleProvinceChange} style={{ border: '1px solid #000', borderRadius: '5px' }}>
                  <option disabled="true" selected="true" value="">- Seleccionar una Provincia-</option>
                  <option value="Ciudad Autónoma de Buenos Aires">Ciudad Autónoma de Buenos Aires</option>
                  <option value="Buenos Aires">Buenos Aires</option>
                  <option value="Catamarca">Catamarca</option>
                  <option value="Chaco">Chaco</option>
                  <option value="Chubut">Chubut</option>
                  <option value="Cordoba">Cordoba</option>
                  <option value="Corrientes">Corrientes</option>
                  <option value="Entre Rios">Entre Rios</option>
                  <option value="Formosa">Formosa</option>
                  <option value="Jujuy">Jujuy</option>
                  <option value="La Pampa">La Pampa</option>
                  <option value="La Rioja">La Rioja</option>
                  <option value="Mendoza">Mendoza</option>
                  <option value="Misiones">Misiones</option>
                  <option value="Neuquen">Neuquen</option>
                  <option value="Rio Negro">Rio Negro</option>
                  <option value="Salta">Salta</option>
                  <option value="San Luis">San Luis</option>
                  <option value="Santa Cruz">Santa Cruz</option>
                  <option value="Santa Fe">Santa Fe</option>
                  <option value="Santiago del Estereo">Santiago del Estereo</option>
                  <option value="Tierra del Fuego">Tierra del Fuego</option>
                </select>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='form-group text-left'>
                <label htmlFor='contact' className='is-size-6'><b>Localidad</b></label>
                <input type='text' className='form-control' id='location' placeholder='Localidad' onChange={this.handleLocationChange} style={{ border: '1px solid #000', borderRadius: '5px' }} />
              </div>
            </div>
          </div> */}
        <div className='row'>
          <div className='col-md-8 offset-md-2'>
            <div className='form-group text-left'>
              <label className='is-size-6'><b>¿Quién pensas que tiene que ejecutar tu propuesta?</b></label>
              <select id="scale" className="form-control" onChange={this.handleScaleChange} style={{ border: '1px solid #000', borderRadius: '5px' }}>
                <option disabled="true" selected="true" value="">- Seleccione aquí-</option>
                <option value="Municipio">El municipio</option>
                <option value="Provincia">La provincia</option>
                <option value="País">El país</option>
                {/* <option value="Otro">Otro</option> */}
              </select>
            </div>
            {
              this.state.scale === 'Otro' ?
                <div className='form-group text-left'>
                  <label className='is-size-6'><b>Escriba aquí quien cree que deberia ejecutarla</b></label>
                  <input type='text' className='form-control' id='otherScale' placeholder='Escriba aquí' onChange={this.handleOtherScaleChange} style={{ border: '1px solid #000', borderRadius: '5px' }} />
                </div>
                : null
            }
            <div className='form-group text-left'>
              <label className='is-size-6'><b>Acá tenés un espacio para contarnos un poco más por qué pensás que es necesaria tu propuesta</b></label>
              <textarea className='form-control' id='description' rows='3' placeholder='Escribí aquí' onChange={this.handleAboutChange} style={{ border: '1px solid #000', borderRadius: '5px' }} />
            </div>
          </div>
        </div>
        <button className='btn btn-primary mt-3' disabled={false} onClick={this.submitMetadata}>Enviar <i className='fas fa-paper-plane' /></button>
      </div>
    )
  }
}

export default Step04
