// basic react
import React, { Component } from 'react'
import { Link } from 'react-router'
// import userConnector from 'lib/site/connectors/user'
import Jump from 'jump.js'
import config from 'lib/config'

class BannerHomeBajada extends Component {

  handleButtonClick = (where) => {
    // Jump(where)
    // const consultasNode = ReactDOM.findDOMNode(this.refs.consultas)
    // window.scrollTo(0, consultasNode.offsetTop)
    let element = document.getElementById(where)
    element.scrollIntoView({
      block: 'center',
      behavior: 'smooth'
    })
  }

  render() {
    return (
      <section
          id="banner-home-bajada"
          className='cover jumbotron'
          style={{
            backgroundImage: `url('${config.imgs.backgroundHome}')`
          }}>
          <div className='jumbotron-body'>
            <div className='container'>
              <p className="bajada-text">GENERÁ EMPATIA</p>
              {/* <img
                src={config.imgs.logoCentralHome}
                className="image mx-auto bajada-image"
                alt="Logo"
              />
              <p className='bajada-text'>
                La revolución que transforma la Argentina
              </p>
              <div className="mt-5">
                  <button
                    className='btn btn-primary mx-2'
                    onClick={() => this.handleButtonClick('grabadora')}
                    >
                    Enviá tu audio a Manes
                  </button>
                  <button
                    className='btn btn-primary btn-main mx-2'
                    onClick={() => this.handleButtonClick('consultas')}
                    >
                    Comentá y votá en las propuestas
                  </button>
              </div> */}
            </div>
          </div>
        </section>
    )
  }
}

export default BannerHomeBajada
