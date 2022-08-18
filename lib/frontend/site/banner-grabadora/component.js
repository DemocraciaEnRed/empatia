import React, { Component } from 'react'
import { Link } from 'react-router'
// import ReactMicRecord from 'react-mic-record'
import userConnector from 'lib/frontend/site/connectors/user'
import Loading from 'lib/frontend/site/banner-grabadora/loading'
import Error from 'lib/frontend/site/banner-grabadora/error'
import Step01 from 'lib/frontend/site/banner-grabadora/step01'
import Step02 from 'lib/frontend/site/banner-grabadora/step02'
import Step03 from 'lib/frontend/site/banner-grabadora/step03'
import Step04 from 'lib/frontend/site/banner-grabadora/step04'
import Step05 from 'lib/frontend/site/banner-grabadora/step05'
import config from 'lib/config'
import ReCAPTCHA from 'react-google-recaptcha'

class BannerGrabadora extends Component {
  constructor (props) {
    super(props)
    this.state = {
      step: 1,
      isLoading: false,
      showError: false,
      blockedMicrophone: false,
      dni: '',
      fullname: '',
      idAudio: '',
      recordingSubmitted: false,
      captchaKey: '',
      // data
      contact: '',
      email: '',
      location: '',
      province: '',
      about: '',
      scale: ''
    }
    this.showError = this.showError.bind(this)
    this.setLoading = this.setLoading.bind(this)
    this.goToStep = this.goToStep.bind(this)
    this.setFirstData = this.setFirstData.bind(this)
    this.setAudioData = this.setAudioData.bind(this)
    this.onCaptchaChange = this.onCaptchaChange.bind(this)
    this.submitRecording = this.submitRecording.bind(this)
    this.submitLastStep = this.submitLastStep.bind(this)
    this.submitRecordingToServer = this.submitRecordingToServer.bind(this)
    this.submitDescriptionToserver = this.submitDescriptionToserver.bind(this)
  }

  componentDidMount () {

  }

  onCaptchaChange (key) {
    this.setState({ captchaKey: key })
    if (this.state.step === 3) {
      this.submitRecordingToServer()
    }
    if (this.state.step === 4) {
      this.submitDescriptionToserver()
    }
  }

  scrollToGrabadora = () => {
    let element = document.getElementById('grabadora')
    element.scrollIntoView({
      block: 'center',
      behavior: 'smooth'
    })
  }

  showError () {
    this.setState({
      showError: true
    })
  }

  setLoading (status) {
    this.setState({
      isLoading: status
    })
  }

  goToStep = (step) => {
    this.setState({
      step: step
    })
  }

  setFirstData = (dni, fullname) => {
    this.setState({
      dni: dni,
      fullname: fullname
    })
  }
  setAudioData = (idAudio) => {
    this.setState({
      idAudio: idAudio
    })
  }

  submitRecording = (blobUrl) => {
    this.setState({
      blobUrl: blobUrl,
      captchaKey: ''
    }, () => {
      this.captcha.execute()
    })
  }

  submitLastStep = (payload) => {
    this.setState({
      contact: payload.contact,
      email: payload.email,
      location: payload.location,
      province: payload.province,
      about: payload.about,
      scale: payload.scale,
      captchaKey: ''
    }, () => {
      this.captcha.execute()
    })
  }

  submitRecordingToServer = () => {
    // send a multipart/form-data request to the server
    this.setLoading(true)
    const formData = new FormData()
    // get the blob of the audio recording and convert to a file
    // const blob = new Blob([this.state.blobURL], { type: 'audio/mp3' })
    window.fetch(this.state.blobUrl)
     .then((r) => r.blob())
     .then((blobFile) => new File([blobFile], 'me-at-voice.mp3', { type: 'audio/mp3' }))
     .then((file) => {
       formData.append('audio', file, 'audio.mp3')
       formData.append('dni', this.state.dni)
       formData.append('fullname', this.state.fullname)
       formData.append('captchaResponse', this.state.captchaKey)
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
        this.goToStep(4)
        this.setState({ idAudio: response.data.id, recordingSubmitted: true })
      } else {
        this.showError()
      }
    }).catch((error) => {
      console.error(error)
      this.showError()
    })
    .finally(() => {
      this.setLoading(false)
    })
  }

  submitDescriptionToserver = () => {
    this.setLoading(true)
    const obj = {
      id: this.state.idAudio,
      about: this.state.about || null,
      scale: this.state.scale || null,
      email: this.state.email || null,
      contact: this.state.contact || null,
      province: this.state.province || null,
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
        this.goToStep(5)
      } else {
        this.showError()
      }
    })
    .catch((error) => {
      console.error(error)
      this.showError()
    })
    .finally(() => {
      this.setLoading(false)
    })
  }

  render () {
    const { step, isLoading, showError } = this.state

    let showStep = !isLoading && !showError
    return (
      <div id='grabadora' className='banner-grabadora'>
        <img src='/lib/frontend/site/home-multiforum/barritas-colores.png' className='barritas-colores-top' />
        <img src='/lib/frontend/site/home-multiforum/barritas-colores.png' className='barritas-colores-bottom' />
        {
          <div className='follow-container' onClick={this.scrollToGrabadora}>
            <a className='follow-grabadora'>
              <span className='follow-text'>
              ENVIÁ TU PROPUESTA</span>
            </a>
          </div>
        }
        <div className='container'>
          <h1 className='title'><strong>ENVIÁ TU PROPUESTA LEGISLATIVA</strong></h1>
          {
            isLoading && <Loading />
          }
          {
            showError && <Error />
          }
          {
            showStep && step === 1 &&
            <Step01 
              showError={this.showError}
              setLoading={this.setLoading}
              scrollToGrabadora={this.scrollToGrabadora}
              goToStep={this.goToStep} />
          }
          {
            showStep && step > 1 && step < 5 && config.recaptchaSite &&
              <ReCAPTCHA
                ref={(el) => { this.captcha = el }}
                size='invisible'
                sitekey={config.recaptchaSite}
                onChange={this.onCaptchaChange} />
          }
          {
            showStep && step === 2 &&
              <Step02
                showError={this.showError} 
                setLoading={this.setLoading}
                scrollToGrabadora={this.scrollToGrabadora}
                goToStep={this.goToStep}
                setFirstData={this.setFirstData} />
          }
          {
            showStep && step === 3 &&
              <Step03
                showError={this.showError} 
                setLoading={this.setLoading}
                scrollToGrabadora={this.scrollToGrabadora}
                goToStep={this.goToStep}
                submitRecording={this.submitRecording}
                dni={this.state.dni}
                fullname={this.state.fullname} />
          }
          {
            showStep && step === 4 &&
              <Step04
                showError={this.showError}
                setLoading={this.setLoading}
                scrollToGrabadora={this.scrollToGrabadora}
                goToStep={this.goToStep}
                idAudio={this.state.idAudio}
                recordingSubmitted={this.state.recordingSubmitted}
                submitLastStep={this.submitLastStep} />
          }
          {
            showStep && step === 5 &&
              <Step05
                showError={this.showError}
                setLoading={this.setLoading}
                scrollToGrabadora={this.scrollToGrabadora}
                goToStep={this.goToStep}
                idAudio={this.state.idAudio}
                recordingSubmitted={this.state.recordingSubmitted}
                submitLastStep={this.submitLastStep} />
          }
        </div>
      </div>
    )
  }
}

export default userConnector(BannerGrabadora)
