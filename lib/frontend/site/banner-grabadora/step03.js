import React, { Component } from 'react'
import { Link } from 'react-router'
import MicRecorder from 'mic-recorder-to-mp3'

const Mp3Recorder = new MicRecorder({ bitRate: 128 })

class Step03 extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isRecording: false,
      isRecordingStp: false,
      blobURL: '',
      timeoutId: null,
      intervalCountdownId: null,
      remainingSeconds: 20,
      recordingSubmitted: false,
      recordingSubmittedSuccess: false,
      recordingSubmittedError: false,
    }
    // this.submitMetadata = this.submitMetadata.bind(this)
    this.startRecording = this.startRecording.bind(this)
    this.stopRecording = this.stopRecording.bind(this)
    this.removeSecond = this.removeSecond.bind(this)
    this.resetRecording = this.resetRecording.bind(this)
    this.addLeadingZero = this.addLeadingZero.bind(this)
  }

  componentDidMount () {
    this.props.scrollToGrabadora()
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
    this.props.submitRecording(this.state.blobURL)
  }

  // submitRecording = () => {
  //   // send a multipart/form-data request to the server
  //   this.setState({ isLoading: true })
  //   const formData = new FormData()
  //   // get the blob of the audio recording and convert to a file
  //   // const blob = new Blob([this.state.blobURL], { type: 'audio/mp3' })
  //   window.fetch(this.state.blobURL)
  //    .then((r) => r.blob())
  //    .then((blobFile) => new File([blobFile], 'me-at-voice.mp3', { type: 'audio/mp3' }))
  //    .then((file) => {
  //      formData.append('audio', file, 'audio.mp3')
  //      formData.append('dni', this.props.dni)
  //      formData.append('fullname', this.props.fullname)
  //      // submit formData to the server
  //      return window.fetch('/api/v2/audio/submit', {
  //        method: 'POST',
  //        credentials: 'include',
  //        body: formData
  //      })
  //    })
  //   .then((response) => response.json())
  //   .then((response) => {
  //     if (response.status) {
  //       this.props.setAudioData(response.data.id)
  //       this.goToStep(4)
  //       // this.setState({ idAudio: response.data.id, recordingSubmitted: true, recordingSubmittedSuccess: true, recordingSubmittedError: false, isLoading: false })
  //     } else {
  //       this.props.showError()
  //     }
  //   }).catch((error) => {
  //     console.error(error)
  //     this.props.showError()
  //   })
  // }

  addLeadingZero = (num) => {
    return num < 10 ? '0' + num : num
  }

  render () {
    let { isRecording, isRecordingStp, blobURL, remainingSeconds } = this.state
    return (
      <div>
        {
          !isRecording && !blobURL &&
          <div>
            <div className="step-title-container my-3">¡COMENCEMOS!</div>
            <p className='subtitle'>Grabate contando tu propuesta con un audio de hasta 20 segundos.</p>
            <p className='subtitle'>Al final podrás revisarlo y enviarlo. <b>Clickeá el microfono para comenzar.</b></p>
            <div className='boton-grabar' onClick={this.startRecording}>
              <i className='fa-solid fa-microphone' />
            </div>
          </div>
        }
        {
          isRecording &&
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
        }
        {
          !isRecording && blobURL &&
          <div>
            <div className="step-title-container my-3">¡REVISÁ TU AUDIO!</div>
            <p className='subtitle'>Antes de enviarlo, revisá que se escuche adecuadamente.<br/>Podés volver a grabarlo.</p>
            <div className='my-3'>{ isRecordingStp && blobURL && <audio src={this.state.blobURL} controls='controls' style={{ width: '400px', margin: '10px 0px' }} /> }</div>
            <div><button className='btn btn-light mx-3' onClick={() => this.resetRecording()}>Volver a grabar&nbsp;<i className='fa-solid fa-rotate-left' /></button>
              <button className='btn btn-primary mx-3' onClick={() => this.submitRecording()}>Enviar&nbsp;<i className='fa-solid fa-paper-plane' /></button></div>
          </div>
        }
      </div>
    )
  }
}

export default Step03
