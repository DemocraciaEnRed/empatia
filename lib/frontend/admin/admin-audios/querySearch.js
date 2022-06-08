import React, { Component } from 'react'
import t from 't-component'
import 'whatwg-fetch'
import moment from 'moment'

export default class QuerySearch extends Component {
  constructor (props) {
    super(props)

    this.state = {
      spam: false,
      featured: false,
      group: '',
      subgroup: '',
      reaction: null,
      user: '',
      email: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.changeReaction = this.changeReaction.bind(this)
    this.search = this.search.bind(this)
    this.restart = this.restart.bind(this)
  }

  componentDidMount () {
        
  }

  handleInputChange (e) {
    let data = {}
    data[e.target.name] = e.target.value
    this.setState(data)
  }

  changeReaction (reaction) {
    if(this.state.reaction == reaction) {
      this.setState({
        reaction: null
      })
    }
    else {
      this.setState({
        reaction: reaction
      })
    }
  }

  closeWarnings () {
    this.setState({
      showWarning: false
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
  
  search () {
    let query = {}
    if (this.state.featured) query.featured = true
    if (this.state.spam) query.spam = true
    if (this.state.group) query.group = this.state.group
    if (this.state.subgroup) query.subgroup = this.state.subgroup
    if (this.state.reaction) query.reaction = this.state.reaction
    if (this.state.user) query.user = this.state.user
    if (this.state.email) query.email = this.state.email
    console.log('checking query', query)
    if (!this.isEmpty(query)) {
      console.log('lets gooooo')
      this.props.search(query)
    }
  }

  restart () {
    this.setState({
      page: 0,
      spam: false,
      featured: false,
      group: '',
      subgroup: '',
      reaction: null,
      user: '',
      email: ''
    })
  }

  render () {
    // let { proyectistas } = this.state
    return ( 
      <div id="queryAudios" className="well">
        <h5 className="mb-3">Filtros</h5>
        <div className='row'>
          <div className='col-md-4'>
            <div className='form-group'>
              <label>Tipo</label>
              <select className='form-control'>
                <option value='0'>Todos</option>
                <option value='1'>⭐ Destacados</option>
                <option value='2'>🚫 Spam</option>
                <option value='3'>Sin tag</option>
              </select>
            </div>
          </div>
          <div className='col-md-2'>
            <div className='form-group'>
              <label>Grupo</label>
              <input type='text' className='form-control' />
            </div>
          </div>
          <div className='col-md-2'>
            <div className='form-group'>
              <label>Subgrupo</label>
              <input type='text' className='form-control' />
            </div>
          </div>
          <div className='col-md-4'>
            <div className='form-group'>
              <label>Reaccion</label>
              <div>
                <span className={`reaction ${this.state.reaction === '1' && 'selected'}`} onClick={() => this.changeReaction('1')}>🙂</span>
                <span className={`reaction ${this.state.reaction === '2' && 'selected'}`} onClick={() => this.changeReaction('2')}>😟</span>
                <span className={`reaction ${this.state.reaction === '3' && 'selected'}`} onClick={() => this.changeReaction('3')}>🤔</span>
                <span className={`reaction ${this.state.reaction === '4' && 'selected'}`} onClick={() => this.changeReaction('4')}>😡</span>
                <span className={`reaction ${this.state.reaction === '' && 'selected'}`} onClick={() => this.changeReaction('')}>❓</span>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-4'>
            <div className='form-group'>
              <label>Nombre</label>
              <input type='text' className='form-control' />
            </div>
          </div>
          <div className='col-md-4'>
            <div className='form-group'>
              <label>Email</label>
              <input type='text' className='form-control' />
            </div>
          </div>
          <div className='col-md-4'>
            <div className='form-group'>
              <label>&nbsp;</label>
              <div>
                <button onClick={this.restart} className='btn btn-default mx-1'>Reiniciar</button>
                <button onClick={this.search} className='btn btn-primary mx-1'>Buscar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
