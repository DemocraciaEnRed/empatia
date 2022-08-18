import React, { Component } from 'react'
import { Link } from 'react-router'

class Step01 extends Component {
  constructor (props) {
    super(props)
    this.state = {
      askedPermission: false,
      askingPermission: false,
      isBlocked: false,
      showAskPermissionOverlay: false
    }
    this.askPermission = this.askPermission.bind(this)
  }

  askPermission = () => {
    this.props.scrollToGrabadora()
    let timeoutId = setTimeout(() => {
      this.setState({
        showAskPermissionOverlay: true,
        askingPermission: true,
        askedPermission: false,
        isBlocked: true
      })
    }, 500)
    navigator.getUserMedia = (
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia
     )
     // Detects the action on user click to allow or deny permission of audio device
    navigator.getUserMedia({ audio: true },
      () => {
        clearTimeout(timeoutId)
        console.log('Permission Granted')
        this.props.scrollToGrabadora()
        this.props.goToStep(2)
      },
      () => {
        console.log('Permission Denied')
        clearTimeout(timeoutId)
        this.setState({ askedPermission: true, isBlocked: true, askingPermission: false, showAskPermissionOverlay: false },
          () => {
            this.props.scrollToGrabadora()
          }
        )
      },
    )
  }
  
  closeAskPermissionOverlay = () => {
    this.setState({ showAskPermissionOverlay: false })
  }

  render () {
    const { askedPermission, isBlocked, askingPermission, showAskPermissionOverlay } = this.state

    let theIcons = () => {
      return (
        <div>
          <p>Vamos a analizarlas y subir a nuestra plataforma para que los demás usuarios puedan opinar y mostrar su apoyo.<br/>
            Finalmente, las mejores propuestas serán presentadas para ser consideradas por los legisladores de tu ciudad.</p>
          <p style={{ fontSize: '1.5rem', color: '#679ed5', fontWeight: '500' }}>Esta es una nueva oportunidad de moldear el país que anhelamos</p>
          <div className='about-icons-container my-4'>
            <div className='icon-container'>
              <img
                className='the-icon mx-auto'
                src='/lib/frontend/site/home-multiforum/microphone.svg'
                alt='Grabá tu audio' />
              <p className="mt-3 mb-1"><b>GRABÁ TU AUDIO</b></p>
              <p className="mt-1 mb-0">Hasta 20 segundos</p>
              <span className="step-marker-below-center step1">
                1
              </span>
            </div>
            <div className='icon-container'>
              <img
                className='the-icon mx-auto'
                src='/lib/frontend/site/home-multiforum/waves.svg'
                alt='Revisá tu propuesta' />
              <p className="mt-3 mb-1"><b>ESCUCHALO Y REVISALO</b></p>
              <p className="mt-1 mb-0">Podés volver a grabarlo</p>
              <span className="step-marker-below-center step2">
                2
              </span>
            </div>
            <div className='icon-container'>
              <img
                className='the-icon mx-auto'
                src='/lib/frontend/site/home-multiforum/audio.svg'
                alt='¡Enviá tu propuesta!' />
              <p className="mt-3 mb-1"><b>¡ENVIÁ TU PROPUESTA!</b></p>
              <p className="mt-1 mb-0">Nuestro equipo te contactará</p>
              <span className="step-marker-below-center step3">
                3
              </span>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div>
        {
          showAskPermissionOverlay &&
          <div className='ask-permission-container'>
            <div className='ask-permission-inner'>
              <h2>Permitir usar micrófono</h2>
              <p>Para grabar tu mensaje de audio,<br />necesitamos que le des permiso al navegador para usar tú micrófono.</p>
              <button className='btn btn-primary' onClick={this.closeAskPermissionOverlay}>Entendido</button>
            </div>
          </div>
        }
        {/* <p className='subtitle'>Grabate contando tú propuesta con un audio de hasta 20 segundos<br />Al finalizar, podras revisarlo y enviarlo</p> */}
        {
          theIcons()
        }
        {
          askingPermission ?
            <p className='text-center animate__animated animate__flash text-danger animate__infinite is-size-5'>Solicitando permiso...</p>
              : <button className='btn btn-main btn-lg' onClick={this.askPermission}>Click para comenzar</button>
        }
        <p className='help-text my-3'>* Se te pedirá habilitar el micrófono para grabar</p>
        {
          askedPermission && isBlocked && (
            <div className='text-center'>
              <p>
                <i className='fas fa-microphone-lines-slash fa-3x' />
              </p>
              <p className='text-danger is-size-5 mb-2'>
                No se pudo acceder al micrófono.
              </p>
              <p className='text-danger'>
                Por favor, intentá nuevamente recargando la página.<br></br>Si el problema persiste, reiniciá los permisos del navegador, o intentalo en otro navegador o en una computadora
              </p>
            </div>
          )
        }
      </div>
    )
  }
}

export default Step01
