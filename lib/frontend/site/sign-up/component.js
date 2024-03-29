import React, { Component } from 'react'
import { Link } from 'react-router'
import bus from 'bus'
import t from 't-component'
import ReCAPTCHA from 'react-google-recaptcha'
import config from 'lib/config'
import randomWords from './randomwords'
import FormAsync from 'lib/frontend/site/form-async'

export default class SignUp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      active: null,
      errors: null,
      name: '',
      lastName: '',
      dni: '',
      provincia: '',
      localidad: '',
      contacto: '',
      email: '',
      pass: '',
      captchaKey: ''
    }
    this.onSuccess = this.onSuccess.bind(this)
    this.onFail = this.onFail.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.saveName = this.saveName.bind(this)
    this.saveLastName = this.saveLastName.bind(this)
    this.saveDNI = this.saveDNI.bind(this)
    this.saveProvincia = this.saveDNI.bind(this)
    this.saveLocalidad = this.saveLocalidad.bind(this)
    this.saveContacto = this.saveContacto.bind(this)
    this.saveEmail = this.saveEmail.bind(this)
    this.savePass = this.savePass.bind(this)
    this.checkPassLength = this.checkPassLength.bind(this)
    this.onCaptchaChange = this.onCaptchaChange.bind(this)
    this.onSubmitClick = this.onSubmitClick.bind(this)
    this.createRandomString = this.createRandomString.bind(this)
    this.anotherUser = this.anotherUser.bind(this)
  }

  componentWillMount () {
    bus.emit('user-form:load', 'signup')
    this.setState({ active: 'form' })
  }
  

  componentWillUnmount () {
    bus.emit('user-form:load', '')
  }

  onSubmit () {
    this.setState({ loading: true, errors: null })
  }

  onSuccess (res) {
    this.setState({
      loading: false,
      active: 'congrats',
      errors: null,
      captchaKey: ''
    })
  }

  onFail (err) {
    this.setState({ loading: false, errors: err, captchaKey: '' })
  }

  saveName (e) {
    this.setState({ name: e.target.value })
  }

  saveLastName (e) {
    this.setState({ lastName: e.target.value })
  }

  saveDNI (e) {
    this.setState({ dni: e.target.value })
  }
  
  saveProvincia (e) {
    this.setState({ provincia: e.target.value })
  }

  saveLocalidad (e) {
    this.setState({ localidad: e.target.value })
  }

  saveContacto (e) {
    this.setState({ contacto: e.target.value })
  }

  saveEmail (e) {
    this.setState({ email: e.target.value })
  }

  savePass (e) {
    this.setState({ pass: e.target.value })
  }
  
  anotherUser () {
    this.setState({
      loading: false,
      active: 'form',
      errors: null,
      name: '',
      lastName: '',
      dni: '',
      provincia: '',
      localidad: '',
      contacto: '',
      email: '',
      pass: '',
      captchaKey: ''
    })
  }

  checkPassLength (e) {
    const passLength = e.target.value

    if (passLength.length < 6) {
      e.target.setCustomValidity(t('validators.min-length.plural', { n: 6 }))
    } else {
      if (e.target.name === 're_password' && e.target.value !== this.state.pass) {
        e.target.setCustomValidity(t('common.pass-match-error'))
      } else {
        e.target.setCustomValidity('')
      }
    }
  }

  createRandomString (e) {
    if(!config.allowPublicSignUp){
      let pickRandomAdjective = randomWords.adjective[Math.floor(Math.random() * randomWords.adjective.length)]
      let picRandomNoun = randomWords.adjective[Math.floor(Math.random() * randomWords.adjective.length)]
      let thePassword = `${pickRandomAdjective}${picRandomNoun.charAt(0).toUpperCase() + picRandomNoun.slice(1)}`
      document.getElementById('signup-pass').value = thePassword
      this.setState({ pass: thePassword }, () => {
        document.getElementById('signup-pass').focus()
      })
    }
  }

  onCaptchaChange (key) {
    this.setState({ captchaKey: key })
    this.refs.submitBtn.click()
  }

  onSubmitClick (e) {
    if (config.recaptchaSite && !this.state.captchaKey) {
      this.captcha.execute()
      e.preventDefault()
    }
  }

  render () {
    return (
      <div className='center-container'>
        {
          this.state.active === 'form' &&
          (
            <div id='signup-form'>
              <div className='title-page'>
                <div className='circle'>
                  <i className='icon-user' />
                </div>
                { config.allowPublicSignUp ?
                <h1>{t('signup.with-email')}</h1>
                : <h1>Registrar un usuario</h1>
                }
              </div>
              <FormAsync
                action='/api/signup'
                onSubmit={this.onSubmit}
                onSuccess={this.onSuccess}
                onFail={this.onFail}>
                {config.recaptchaSite && config.allowPublicSignUp && (
                  <ReCAPTCHA
                    ref={(el) => { this.captcha = el }}
                    size='invisible'
                    sitekey={config.recaptchaSite}
                    onChange={this.onCaptchaChange} />
                )}
                <input
                  type='hidden'
                  name='reference'
                  value={this.props.location.query.ref} />
                <ul
                  className={this.state.errors ? 'form-errors' : 'hide'}>
                  {
                    this.state.errors && this.state.errors
                      .map((error, key) => (<li key={key}>{error}</li>))
                  }
                </ul>
                <div className='form-group'>
                  <label htmlFor=''>{t('signup.email')}</label>
                  <input
                    type='email'
                    className='form-control'
                    name='email'
                    maxLength='200'
                    onChange={this.saveEmail}
                    placeholder={t('forgot.mail.example')}
                    required />
                </div>
                <div className='form-group'>
                  <label htmlFor=''>{t('signup.your-firstname')}</label>
                  <input
                    type='text'
                    className='form-control'
                    id='firstName'
                    name='firstName'
                    maxLength='100'
                    placeholder={t('signup.firstname')}
                    onChange={this.saveName}
                    required />
                </div>
                <div className='form-group'>
                  <label htmlFor=''>{t('signup.your-lastname')}</label>
                  <input
                    type='text'
                    className='form-control'
                    id='lastName'
                    name='lastName'
                    maxLength='100'
                    onChange={this.saveLastName}
                    placeholder={t('signup.lastname')}
                    required />
                </div>
                <div className='form-group'>
                  <label htmlFor=''>DNI</label>
                  <input
                    type='text'
                    className='form-control'
                    id='dni'
                    name='dni'
                    maxLength='20'
                    onChange={this.saveDNI}
                    placeholder='12345678'
                    />
                </div>
                <div className='form-group'>
                  <label htmlFor=''>Provincia</label>
                  <input
                    type='text'
                    className='form-control'
                    id='provincia'
                    name='provincia'
                    maxLength='200'
                    onChange={this.saveProvincia}
                    placeholder='Provincia'
                    />
                </div>
                <div className='form-group'>
                  <label htmlFor=''>Localidad</label>
                  <input
                    type='text'
                    className='form-control'
                    id='localidad'
                    name='localidad'
                    maxLength='200'
                    onChange={this.saveLocalidad}
                    placeholder='Localidad'
                    />
                </div>
                <div className='form-group'>
                  <label htmlFor=''>Nro. de teléfono</label>
                  <input
                    type='text'
                    className='form-control'
                    id='contacto'
                    name='contacto'
                    maxLength='200'
                    onChange={this.saveContacto}
                    placeholder='Contacto'
                    />
                </div>
                { config.allowPublicSignUp ?
                <div className='form-group'>
                  <label htmlFor=''>{t('password')}</label>
                  <input
                    id='signup-pass'
                    className='form-control'
                    name='password'
                    type='password'
                    maxLength='200'
                    onChange={this.savePass}
                    onBlur={this.checkPassLength}
                    placeholder={t('password')}
                    required />
                </div>
                : <div className='form-group'>
                  <label htmlFor=''>{t('password')}</label>
                  <input
                    id='signup-pass'
                    className='form-control'
                    name='password'
                    type='text'
                    maxLength='200'
                    onChange={this.savePass}
                    onBlur={this.checkPassLength}
                    placeholder={t('password')}
                    required />
                    <br/>
                    <a className="btn btn-sm btn-secondary btn-block" onClick={this.createRandomString}>Crear constraseña random</a>
                </div>
                }
                { config.allowPublicSignUp ?
                <div className='form-group'>
                  <label htmlFor=''>{t('signup.retype-password')}</label>
                  <input
                    type='password'
                    className='form-control'
                    name='re_password'
                    onBlur={this.checkPassLength}
                    required />
                </div> :
                <hr/>
                }
                <br></br>
                <div className='form-group'>
                  { config.allowPublicSignUp ?
                    <button
                      ref='submitBtn'
                      onClick={this.onSubmitClick}
                      className={!this.state.loading ? 'btn btn-block btn-success btn-lg' : 'hide'}
                      type='submit'>
                      {t('signup.now')}
                    </button>
                  : <button
                      ref='submitBtn'
                      onClick={this.onSubmitClick}
                      className={!this.state.loading ? 'btn btn-block btn-success' : 'hide'}
                      type='submit'>
                      Registrar
                    </button>
                  }
                  <button
                    className={this.state.loading ? 'loader-btn btn btn-block btn-default btn-lg' : 'hide'}>
                    <div className='loader' />
                    {t('signup.now')}
                  </button>
                </div>
                <p class="text-small" style={{fontWeight: 400, textAlign: 'center', color: '#a0a0a0'}}><small>Al registrarse y dar uso a la plataforma, usted acepta los siguientes <a href="https://drive.google.com/file/d/1daTb_V-eNafUnB_kZJBgtVF3EH0R50l6/view" target="_blank" style={{fontWeight: 400}}>términos y condiciones</a></small></p>
                {
                    (!!config.termsOfService || !!config.privacyPolicy) &&
                    (
                      <div className='form-group accepting'>
                        <p className='help-block text-center'>
                          {t('signup.accepting')}
                        </p>
                        {
                          !!config.termsOfService &&
                          (
                            <Link
                              to='/help/terms-of-service'>
                              {t('help.tos.title')}
                            </Link>
                          )
                        }
                        {
                          !!config.privacyPolicy &&
                          (
                            <Link
                              to='/help/privacy-policy'>
                              {t('help.pp.title')}
                            </Link>
                          )
                        }
                      </div>
                    )
                  }
              </FormAsync>
            </div>
          )
        }
        {
          this.state.active === 'congrats' &&
          (
            config.allowPublicSignUp ?
            <div id='signup-message'>
              <h1>{t('signup.welcome', { name: this.state.name + ' ' + this.state.lastName })}</h1>
              <p className='lead'>{t('signup.received')}</p>
              <p className='lead'>{t('signup.check-email')}</p>
              <Link
                to='/signup/resend-validation-email'>
                {t('signup.resend-validation-email')}
              </Link>
            </div>
            : <div id='signup-message'>
              <h1>Se ha creado el usuario {this.state.name + ' ' + this.state.lastName}</h1>
              <p className='lead'>Hemos enviado un correo electrónico al usuario con sus datos de acceso.</p>
              <p className='lead'>Es importante recordar al usuario que no se olvide de revisar su Correo no deseado.</p>
              <a
                className="btn btn-warning btn-sm"
                onClick={this.anotherUser}>
                Crear otro usuario
              </a>
            </div>
          )
        }
      </div>
    )
  }
}
