import React, { Component } from 'react'
import { Link } from 'react-router'
// import ReactMicRecord from 'react-mic-record'
import MicRecorder from 'mic-recorder-to-mp3'
import userConnector from 'lib/frontend/site/connectors/user'
import config from 'lib/config'

const Mp3Recorder = new MicRecorder({ bitRate: 128 })

class BannerGrabadora extends Component {
    this.state = {
      buttonPressed: false,
      isRecording: false,
      blobURL: '',
      idAudio: null,
      askedPermission: false,
      askingPermission: false,
      isBlocked: false,
      isRecordingStp: false,
      timeoutId: null,
      intervalCountdownId: null,
      remainingSeconds: 20,
      recordingSubmitted: false,
      recordingSubmittedSuccess: false,
      recordingSubmittedError: false,
      reactionSubmitted: false,
      reactionSubmittedSuccess: false,
      reactionSubmittedError: false,
      about: '',
      scale: '',
      contact: '',
      location: '',
      metaSubmitted: false,
      metaSubmittedSuccess: false,
      metaSubmittedError: false,
      idRecording: null,
      showAskPermissionOverlay: false,
      isLoading: false
    }
    this.startRecording = this.startRecording.bind(this)
    this.stopRecording = this.stopRecording.bind(this)
    // this.onData = this.onData.bind(this);
    // this.onStop = this.onStop.bind(this);
    // this.onButtonPressed = this.onButtonPressed.bind(this)
    this.askPermission = this.askPermission.bind(this)
    this.addLeadingZero = this.addLeadingZero.bind(this)
    this.submitRecording = this.submitRecording.bind(this)
    this.submitReaction = this.submitReaction.bind(this)
    this.submitMetadata = this.submitMetadata.bind(this)
    this.handleAboutChange = this.handleAboutChange.bind(this)
    this.handleScaleChange = this.handleScaleChange.bind(this)
    this.handleContactChange = this.handleContactChange.bind(this)
    this.handleLocationChange = this.handleLocationChange.bind(this)
    this.closeAskPermissionOverlay = this.closeAskPermissionOverlay.bind(this)
  }

  componentDidMount () {
    // navigator.getUserMedia = (
    //   navigator.getUserMedia ||
    //   navigator.webkitGetUserMedia ||
    //   navigator.mozGetUserMedia ||
    //   navigator.msGetUserMedia
    //  );
    //  //Detects the action on user click to allow or deny permission of audio device
    //  navigator.getUserMedia({ audio: true },
    //   () => {
    //     console.log('Permission Granted');
    //     this.setState({ isBlocked: false });
    //   },
    //   () => {
    //     console.log('Permission Denied');
    //     this.setState({ isBlocked: true })
    //   },
    // );

    // window.recorder = new MicRecorder({ bitRate: 128 })
    // this.setState({
    //   recorder: new MicRecorder({ bitRate: 128 })
    // })
  }

  askPermission = () => {
    this.scrollToGrabadora()
    let timeoutId = setTimeout(() => {
      this.setState({
        showAskPermissionOverlay: true,
        askingPermission: true
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
        this.setState({ askedPermission: true, askingPermission: false, isBlocked: false, showAskPermissionOverlay: false },
          () => {
            let element = document.getElementById('grabadora')
            element.scrollIntoView({
              block: 'center',
              behavior: 'smooth'
            })
          }
        )
        this.scrollToGrabadora()
      },
      () => {
        console.log('Permission Denied')
        clearTimeout(timeoutId)
        this.setState({ askedPermission: true, isBlocked: true, askingPermission: false, showAskPermissionOverlay: false },
          () => {
            let element = document.getElementById('grabadora')
            element.scrollIntoView({
              block: 'center',
              behavior: 'smooth'
            })
          }
        )
        this.scrollToGrabadora()
      },
    )
  }
  closeAskPermissionOverlay = () => {
    this.setState({ showAskPermissionOverlay: false })
  }

  startRecording = () => {
    // window.recorder.start().then(() => {
    //   // something else
    // }).catch((e) => {
    //   console.error(e);
    // });
    // this.setState({ record: true, recorded: null });

    if (this.state.isBlocked) {
      alert('Permission Denied')
    } else {
      Mp3Recorder
        .start()
        .then(() => {
          let intervalCountdownId = setInterval(() => {
            console.log('interval')
            this.removeSecond()
          }, 1000)
          let timeoutId = setTimeout(() => {
            console.log('timeout recorder: 20s')
            this.stopRecording()
          }, 20000)
          this.setState({ isRecording: true, timeoutId, intervalCountdownId })
        }).catch((e) => {
          alert('An error occurred while starting the recording process.')
          // alert(e)
          console.error(e)
        })
    }
  }

  removeSecond = () => {
    this.setState({ remainingSeconds: this.state.remainingSeconds - 1 })
  }

  stopRecording = () => {
    Mp3Recorder
    .stop()
    .getMp3().then(([buffer, blob]) => {
      // do what ever you want with buffer and blob
      // Example: Create a mp3 file and play
      const file = new File(buffer, 'me-at-thevoice.mp3', {
        type: blob.type,
        lastModified: Date.now()
      })
      console.log('stopped recording')
      clearTimeout(this.state.timeoutId)
      clearInterval(this.state.intervalCountdownId)
      const blobURL = URL.createObjectURL(blob)
      this.setState({ blobURL, isRecording: false, isRecordingStp: true, file, blob })
      // const player = new Audio(URL.createObjectURL(file));
      // player.play();
      // this.setState({ record: false, recorded: file })
    }).catch((e) => {
      alert('We could not retrieve your message')
      console.log(e)
      this.setState({ record: false, recorded: null })
    })
  }

  resetRecording = () => {
    // The user can reset the audio recording
    // once the stop button is clicked
    document.getElementsByTagName('audio')[0].src = ''
    this.setState({ isRecordingStp: false, remainingSeconds: 20, blobURL: null })
  }

  submitRecording = () => {
    // send a multipart/form-data request to the server
    this.setState({ isLoading: true })
    const formData = new FormData()
    // get the blob of the audio recording and convert to a file
    // const blob = new Blob([this.state.blobURL], { type: 'audio/mp3' })
    window.fetch(this.state.blobURL)
     .then((r) => r.blob())
     .then((blobFile) => new File([blobFile], 'me-at-voice.mp3', { type: 'audio/mp3' }))
     .then((file) => {
       formData.append('audio', file, 'audio.mp3')
       // submit formData to the server
       return window.fetch('/api/v2/audio/submit', {
         method: 'POST',
         credentials: 'include',
         body: formData
       })
     })
    .then((response) => response.json())
    .then((response) => {
      if (response.status) {
        this.setState({ idAudio: response.data.id, recordingSubmitted: true, recordingSubmittedSuccess: true, recordingSubmittedError: false, isLoading: false })
        this.scrollToGrabadora()
      } else {
        this.setState({ recordingSubmitted: true, recordingSubmittedSuccess: false, recordingSubmittedError: true, isLoading: false })
        this.scrollToGrabadora()
      }
    }).catch((error) => {
      console.error(error)
      this.setState({ recordingSubmitted: true, recordingSubmittedSuccess: false, recordingSubmittedError: true, isLoading: false })
      this.scrollToGrabadora()
    })
  }

  submitReaction = (reaction) => {
    // this.setState({ reactionSubmitted: true, reactionSubmittedSuccess: true, reactionSubmittedError: false })
    this.setState({ isLoading: true })
    const obj = {
      id: this.state.idAudio,
      reaction: reaction
    }
    window.fetch(`/api/v2/audio/reaction`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((response) => {
      if (response.status) {
        this.setState({ reactionSubmitted: true, reactionSubmittedSuccess: true, reactionSubmittedError: false, isLoading: false })
        this.scrollToGrabadora()
      } else {
        this.setState({ reactionSubmitted: true, reactionSubmittedSuccess: false, reactionSubmittedError: true, isLoading: false })
        this.scrollToGrabadora()
      }
    })
    .catch((error) => {
      console.error(error)
      this.setState({ reactionSubmitted: true, reactionSubmittedSuccess: false, reactionSubmittedError: true, isLoading: false })
    })
  }

  submitMetadata = () => {
    // this.setState({ metaSubmitted: true, metaSubmittedSuccess: true, metaSubmittedError: false })
    this.setState({ isLoading: true })
    const obj = {
      id: this.state.idAudio,
      about: this.state.about || null,
      scale: this.state.scale || null,
      contact: this.state.contact || null,
      location: this.state.location || null
    }
    window.fetch(`/api/v2/audio/description`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((response) => {
      if (response.status) {
        this.setState({ metaSubmitted: true, metaSubmittedSuccess: true, metaSubmittedError: false, isLoading: false })
        this.scrollToGrabadora()
      } else {
        this.setState({ metaSubmitted: true, metaSubmittedSuccess: false, metaSubmittedError: true, isLoading: false })
        this.scrollToGrabadora()
      }
    })
    .catch((error) => {
      console.error(error)
      this.setState({ metaSubmitted: true, metaSubmittedSuccess: false, metaSubmittedError: true, isLoading: false })
      this.scrollToGrabadora()
    })
  }

  addLeadingZero = (num) => {
    return num < 10 ? '0' + num : num
  }

  handleAboutChange = (e) => {
    this.setState({ about: e.target.value })
  }
  handleScaleChange = (e) => {
    this.setState({ scale: e.target.value })
  }
  handleContactChange = (e) => {
    this.setState({ contact: e.target.value })
  }
  handleLocationChange = (e) => {
    this.setState({ location: e.target.value })
  }

  scrollToGrabadora = () => {
    let element = document.getElementById('grabadora')
    element.scrollIntoView({
      block: 'center',
      behavior: 'smooth'
    })
  }

  render () {
    const { user } = this.props
    const {
      isRecording,
      remainingSeconds,
      isRecordingStp,
      blobURL,
      buttonPressed,
      askedPermission,
      askingPermission,
      isBlocked,
      recordingSubmitted,
      recordingSubmittedSuccess,
      recordingSubmittedError,
      reactionSubmitted,
      reactionSubmittedSuccess,
      reactionSubmittedError,
      metaSubmitted,
      metaSubmittedSuccess,
      metaSubmittedError,
      showAskPermissionOverlay,
      about,
      scale,
      contact,
      location,
      isLoading
    } = this.state

    let notLoggedIn = user.state.rejected

    let step1 = !isLoading && !askedPermission
    let step2 = !isLoading && askedPermission && !isRecordingStp && !isBlocked && !isRecording
    let step3 = !isLoading && askedPermission && !isRecordingStp && !isBlocked && isRecording
    let step4 = !isLoading && askedPermission && isRecordingStp && !isRecording && blobURL && !recordingSubmitted
    let step5 = !isLoading && recordingSubmitted && recordingSubmittedSuccess && !reactionSubmitted
    let step6 = !isLoading && reactionSubmitted && reactionSubmittedSuccess && !metaSubmitted
    let step7 = !isLoading && metaSubmitted && metaSubmittedSuccess
    let showError = !isLoading && ((recordingSubmitted && recordingSubmittedError) || (reactionSubmitted && reactionSubmittedError) || (metaSubmitted && metaSubmittedError))

    let theIcons = () => {
      return (
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
            <p className="mt-3 mb-1"><b>GRABÁ TU AUDIO</b></p>
            <p className="mt-1 mb-0">Podes volver a grabarlo</p>
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
            <p className="mt-1 mb-0">Nuestró equipo te contactará</p>
            <span className="step-marker-below-center step3">
              3
            </span>
          </div>
        </div>
      )
    }

    let buttonStart = () => {
      if (notLoggedIn) {
        return (
          <div>
            {/* <p className='subtitle'>Grabate contando tú propuesta con un audio de hasta 20 segundos<br />Al finalizar, podras revisarlo y enviarlo</p> */}
            {
              theIcons()
            }
            <Link href='/signin' className='btn btn-main btn-lg'>Click para comenzar</Link>
            <p className='help-text my-3'>* Debes iniciar sesión para enviar tu audio.<br />De no ser así se te pedira iniciar sesión o que te registres.</p>
          </div>
        )
      } else {
        if (!askedPermission) {
          return (
            <div>
              {/* <p className='subtitle'>Grabate contando tú propuesta con un audio de hasta 20 segundos<br />Al finalizar, podras revisarlo y enviarlo</p> */}
              {
                theIcons()
              }
              {
                askingPermission ? <p className='text-center animate__animated animate__flash text-danger animate__infinite is-size-5'>Solicitando permiso...</p> : <button className='btn btn-main btn-lg' onClick={this.askPermission}>Click para comenzar</button>
              }
              <p className='help-text my-3'>* Se te pedirá habilitar el micrófono para grabar</p>
            </div>
          )
        }
        return null
      }
    }

    let blockedMicrophone = () => {
      return (
        <div className='text-center'>
          <p>
            <i className='fas fa-microphone-lines-slash fa-3x' />
          </p>
          <p className='text-danger is-size-5 mb-2'>
            No se pudo acceder al micrófono.
          </p>
          <p className='text-danger'>
            Por favor, intentá nuevamente recargando la página.
          </p>
        </div>
      )
    }

    let somethingHappened = () => {
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

    return (
      <div id='grabadora' className='banner-grabadora'>
        {
          (this.props.user.state.rejected || (this.props.user.state.fulfilled && !this.props.user.state.value.proyectista && !buttonPressed)) &&
          <div className='follow-container' onClick={this.scrollToGrabadora}>
            <a className='follow-grabadora'>
              <span className='follow-text'>
              ENVIÁ TU PROPUESTA</span>
            </a>
          </div>
        }
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
        <img src='/lib/frontend/site/home-multiforum/barritas-colores.png' className='barritas-colores-top' />
        <img src='/lib/frontend/site/home-multiforum/barritas-colores.png' className='barritas-colores-bottom' />

        <div className='container'>
          <h1 className='title'><strong>ENVIÁ TU PROPUESTA</strong></h1>
          {
            isLoading && (
              <div className='my-5'>
                <p><i className='fa-solid fa-3x fa-spin fa-sync' /></p>
                <p className='is-size-5' style={{ letterSpacing: '5px' }}>Cargando</p>
              </div>
            )
          }
          {
            showError && somethingHappened()
          }
          {
            askedPermission && isBlocked && (
              <div>
                {theIcons()}
                {blockedMicrophone()}
              </div>
            )
          }
          { step1 &&
            buttonStart()
          }

          { step2 && (
            <div>
              <div className="step-title-container my-3">¡COMENCEMOS!</div>
              <p className='subtitle'>Grabate contando tu propuesta con un audio de hasta 20 segundos.</p>
              <p className='subtitle'>Al final podrás revisarlo y enviarlo. <b>Clickeá el microfono para comenzar.</b></p>
              <div className='boton-grabar' onClick={this.startRecording}>
                <i className='fa-solid fa-microphone' />
              </div>
            </div>
          )
        }
          { step3 && (
          <div>
            <div className="step-title-container my-3 animate__animated animate__flash animate__infinite animate__slow">GRABANDO</div>
            <br/>
            {/* <p className='subtitle animate__animated animate__flash animate__infinite animate__slow recording-icon"'>Grabando</p> */}
            <div className='boton-stop' onClick={this.stopRecording}>
              <i className='fa-solid fa-stop' />
            </div>
            <div className='countdown mt-3'>
              <span className='countdown-text'><i className='fas fa-circle animate__animated animate__flash animate__infinite recording-icon' />&nbsp;00:{this.addLeadingZero(remainingSeconds)}</span>
            </div>
          </div>
          )
        }

          {/* <button className="btn btn-light" onClick={this.startRecording} disabled={this.state.isRecording}>Record</button>

        <button className="btn btn-danger" onClick={this.stopRecording} disabled={!this.state.isRecording}>Stop</button>

        <button className="btn btn-warning" onClick={this.resetRecording} disabled={!this.state.isRecordingStp}>Reset</button> */}
          { step4 && (
          <div>
            <div className="step-title-container my-3">PASO 1</div>
            <p className='subtitle'>Antes de enviarlo, revisá que se escuche adecuadamente.<br/>Podés volver a grabarlo.</p>
            <div className='my-3'>{ isRecordingStp && blobURL && <audio src={this.state.blobURL} controls='controls' style={{ width: '400px', margin: '10px 0px' }} /> }</div>
            <div><button className='btn btn-light mx-3' onClick={() => this.resetRecording()}>Volver a grabar&nbsp;<i className='fa-solid fa-rotate-left' /></button>
              <button className='btn btn-primary mx-3' onClick={() => this.submitRecording()}>Enviar&nbsp;<i className='fa-solid fa-paper-plane' /></button></div>
          </div>
          )
        }
          { step5 && (
            <div>
              <div className="step-title-container my-3">PASO 2</div>
              <p className='is-size-5'><b>¡Gracias por mandar tú audio!</b></p>
              <p className='subtitle'>Si tuvieras que asociar un emoji a tu audio...<br />¿Cual eligirias?</p>
              {/* List of emojis */}
              <div className='emojis-container'>
                {/* <span className='emoji-icon' onClick={() => this.submitReaction('1')} ></span>
                <span className='emoji-icon' onClick={() => this.submitReaction('2')} ></span>
                <span className='emoji-icon' onClick={() => this.submitReaction('3')} ></span>
                <span className='emoji-icon' onClick={() => this.submitReaction('4')} ></span> */}
                <img
                  className='emoji-icon mx-auto'
                  src='/lib/frontend/site/home-multiforum/reaction1.png'
                  onClick={() => this.submitReaction('1')}
                  alt='Me gusta' />
                <img
                  className='emoji-icon mx-auto'
                  src='/lib/frontend/site/home-multiforum/reaction2.png'
                  onClick={() => this.submitReaction('2')}
                  alt='Me encanta' />
                <img
                  className='emoji-icon mx-auto'
                  src='/lib/frontend/site/home-multiforum/reaction3.png'
                  onClick={() => this.submitReaction('3')}
                  alt='Me deprime' />
                <img
                  className='emoji-icon mx-auto'
                  src='/lib/frontend/site/home-multiforum/reaction4.png'
                  onClick={() => this.submitReaction('4')}
                  alt='Me enoja' />
              </div>
            </div>
          )
        }
          { step6 && (
          <div>
            <div className="step-title-container my-3">ÚLTIMO PASO</div>
            {/* <p className='is-size-5 text-primary'><b>¡Muchas gracias!</b></p> */}
            <p className='mb-5'>Por favor colocale un título a tu idea/propuesta para poder identificarla.<br />también podés darnos más información para dirigirlo a quien corresponda.</p>
            <div className='row'>
              <div className='col-md-5 offset-md-1'>
                <div className='form-group text-left'>
                  <label htmlFor='about' className='is-size-6'><b>Título de tú propuesta</b> <small className='text-danger is-size-7'>* Requerido</small></label>
                  <input type='text' className='form-control' id='about' placeholder='Título' onChange={this.handleAboutChange} style={{ border: '1px solid #000', borderRadius: '5px' }} />
                </div>
              </div>
              <div className='col-md-5'>
                <div className='form-group text-left'>
                  <label htmlFor='scale' className='is-size-6'><b>¿A donde escala tú propuesta?</b> <small className='text-danger is-size-7'>* Requerido</small></label>
                  <select className='form-control' id='scale' onChange={this.handleScaleChange} style={{ border: '1px solid #000', borderRadius: '5px' }} >
                    <option value='' selected disabled>- Seleccioná una respuesta -</option>
                    <option value='Municipio'>Al municipio</option>
                    <option value='Provincia'>A la provincia</option>
                    <option value='País'>Al país</option>
                    <option value='No lo sé'>No lo sé</option>
                  </select>
                  {/* <input type="text" className="form-control" id="about" placeholder="Título" onChange={this.handleAboutChange} /> */}
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-5 offset-md-1'>
                <div className='form-group text-left'>
                  <label htmlFor='contact' className='is-size-6'><b>Contacto</b> <small className='is-size-7'>(Opcional)</small></label>
                  <input type='text' className='form-control' id='contact' placeholder=' Nro de telefono o Email' onChange={this.handleContactChange} style={{ border: '1px solid #000', borderRadius: '5px' }} />
                </div>
              </div>
              <div className='col-md-5'>
                <div className='form-group text-left'>
                  <label htmlFor='about' className='is-size-6'><b>Tu localidad</b> <small className='is-size-7'>(Opcional)</small></label>
                  <input type='text' className='form-control' id='about' placeholder='Provincia y municipio' onChange={this.handleLocationChange} style={{ border: '1px solid #000', borderRadius: '5px' }} />
                </div>
              </div>
            </div>
            <button className='btn btn-primary mt-3' disabled={!about || !scale} onClick={this.submitMetadata}>Enviar <i className='fas fa-paper-plane' /></button>
          </div>
            )
          }
          { step7 && (
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
        </div>
      </div>

    )
  }
}

export default userConnector(BannerGrabadora)
