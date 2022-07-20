import React, { Component } from 'react'
import t from 't-component'
import 'whatwg-fetch'
// import urlBuilder from 'lib/url-builder'
// import { limit } from '../../api-v2/validate/schemas/pagination'
import moment from 'moment'

export default class EditAudio extends Component {
  constructor (props) {
    super(props)

    this.state = {
      file: null,
      user: {},
      fullName: '',
      email: '',
      featured: false,
      spam: false,
      group: '',
      subgroup: '',
      about: '',
      contact: '',
      location: '',
      scale: '',
      resolved: false,
      isLoading: false,
      messages: [],
      showSuccess: false,
      showWarning: false
    }

    this.closeWarnings = this.closeWarnings.bind(this);
    this.changeReaction = this.changeReaction.bind(this);
    this.setFeatured = this.setFeatured.bind(this);
    this.setSpam = this.setSpam.bind(this);
    this.unsetSpamFeatured = this.unsetSpamFeatured.bind(this);
    this.saveData = this.saveData.bind(this);
    this.setResolved = this.setResolved.bind(this);

  }

  componentDidMount () {
    this.setState({
      file: this.props.audio.file,
      user: this.props.audio.user,
      fullName: this.props.audio.fullName,
      email: this.props.audio.email,
      featured: this.props.audio.featured,
      spam: this.props.audio.spam,
      about: this.props.audio.about || '',
      contact: this.props.audio.contact || '',
      location: this.props.audio.location || '',
      scale: this.props.audio.scale || '',
      group: this.props.audio.group || '',
      resolved: this.props.audio.resolved || false,
      reaction: this.props.audio.reaction || '',
      subgroup: this.props.audio.subgroup || '',
      messages: this.props.audio.messages
    })
    this.scrollTo()
  }

  handleInputChange (e) {
    let data = {}
    data[e.target.name] = e.target.value
    this.setState(data)
  }

  changeReaction (reaction) {
    this.setState({ reaction })
  }
  setFeatured () {
    this.setState({ featured: true, spam: false })
  }
  setResolved (e) {
    // handle the change from a checkbox
    this.setState({
      resolved: e.target.checked
    })
  }
  setSpam () {
    this.setState({ featured: false, spam: true })
  }
  unsetSpamFeatured () {
    this.setState({ featured: false, spam: false })
  }

  closeWarnings () {
    this.setState({
      showWarning: false
    })
  }

  saveData () {
    // savedata
    this.setState({
      isLoading: true
    })
    let data = {
      featured: this.state.featured,
      spam: this.state.spam,
      group: this.state.group === '' ? null : this.state.group,
      subgroup: this.state.subgroup === '' ? null : this.state.subgroup,
      about: this.state.about,
      contact: this.state.contact,
      location: this.state.location,
      scale: this.state.scale,
      resolved: this.state.resolved,
      reaction: this.state.reaction === '' ? null : this.state.reaction
    }
    window.fetch(`/api/v2/audio/admin/${this.props.audio._id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then((res) => {
      if (res.status === 200) {
        return res
      }
    })
    .then((res) => res.json())
    .then((res) => {
      this.props.update(res)
      // this.setState({
      //   showSuccess: true
      // })
    })
    .catch((err) => {
      this.setState({
        showWarning: true
      })
      console.log(err)
    })
  }

  // object is not empty
  isEmpty (obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  scrollTo = () => {
    let element = document.getElementById('editarAudio')
    element.scrollIntoView({
      block: 'center',
      behavior: 'smooth'
    })
  }

  render () {
    const { file, user, fullName, email, featured, spam, about, reaction, group, subgroup, scale, contact, location, resolved, isLoading, messages, showSuccess, showWarning} = this.state
    // let { proyectistas } = this.state
    return (
      <div id="editarAudio">
        <div className="panel panel-primary">
          <div className="panel-heading">
            <span><i className="fas fa-pencil" /> Editar audio</span>
          </div>
          <div className="panel-body">
            <div className="row">
              <div className="col-md-4">
                <p className="mb-0"><b>Usuario</b></p>
                {
                  user ?
                  <p>{user.lastName}, {user.firstName}</p>
                  : <p>{fullName || '(Sin completar)'} <span className="text-warning is-size-7">(No registrado)</span></p>
                }
              </div>
              <div className="col-md-4">
                <p className="mb-0"><b>Email</b></p>
                {
                  user ? 
                  <p>{user.email}</p>
                  : <p>{email || '(Sin completar)'}</p>
                }
              </div>
              <div className="col-md-2">
                <div className="form-group">
                  <label>Grupo</label>
                   <input type='text' className="form-control input-sm" name='group' value={group} onChange={this.handleInputChange.bind(this)} placeholder="Grupo"/>
                </div>
              </div>
              <div className="col-md-2">
                <div className="form-group">
                  <label>Subgrupo</label>
                  <input type='text' className="form-control input-sm" name='subgroup' value={subgroup} onChange={this.handleInputChange.bind(this)} placeholder="Subgrupo"/>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label>Escala</label>
                   <input type='text' className="form-control input-sm" name='scale' value={scale} onChange={this.handleInputChange.bind(this)} placeholder="Escala"/>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Contacto</label>
                  <input type='text' className="form-control input-sm" name='contact' value={contact} onChange={this.handleInputChange.bind(this)} placeholder="Contacto"/>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Localidad</label>
                  <input type='text' className="form-control input-sm" name='location' value={location} onChange={this.handleInputChange.bind(this)} placeholder="Localidad"/>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea className="form-control" name='about' value={about} onChange={this.handleInputChange.bind(this)} rows="2" placeholder="Descripción del audio" />
            </div>
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <label>Marcar</label>
                  <div className="radio">
                    <label>
                      <input type="radio" checked={featured} onChange={this.setFeatured} /><i className="fas fa-star fa-fw"/> &nbsp;Destacado
                    </label>
                  </div>
                  <div className="radio">
                    <label>
                      <input type="radio" checked={spam} onChange={this.setSpam} /><i className="fas fa-ban fa-fw"/> &nbsp;Spam
                    </label>
                  </div>
                  <div className="radio">
                    <label>
                      <input type="radio" checked={!spam && !featured} onChange={this.unsetSpamFeatured} />Nada
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Reacción</label>
                  <div>
                    <span className={`reaction ${reaction == '1' && 'selected'}`} onClick={() => this.changeReaction('1')}>🙂</span>
                    <span className={`reaction ${reaction == '2' && 'selected'}`} onClick={() => this.changeReaction('2')}>😟</span>
                    <span className={`reaction ${reaction == '3' && 'selected'}`} onClick={() => this.changeReaction('3')}>🤔</span>
                    <span className={`reaction ${reaction == '4' && 'selected'}`} onClick={() => this.changeReaction('4')}>😡</span>
                    <span className={`reaction ${reaction == '' && 'selected'}`} onClick={() => this.changeReaction('')}>❓</span>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  {/* checkbox */}
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" checked={resolved} onChange={this.setResolved} />
                      Resuelto
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 text-right">
                <button className="btn btn-sm btn-default" onClick={this.props.cancel}><i className="fas fa-save" />&nbsp;Cancelar</button>&nbsp;
                <button className="btn btn-sm btn-primary" onClick={this.saveData}><i className="fas fa-save" />&nbsp;Guardar</button>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </div>
    )
  }
}
