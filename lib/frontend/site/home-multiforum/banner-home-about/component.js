// basic react
import React, { Component } from 'react'
import { Link } from 'react-router'
// import userConnector from 'lib/site/connectors/user'
import config from 'lib/config'

class BannerHomeAbout extends Component {
  render () {
    return (
      <div id='banner-home-auto' className='container'>
        <div className='py-5'>
          <p className='is-size-3 my-4 text-center'>Empatía es otra forma de representarte</p>
          <div className='row'>
            <div className='col-md-8 offset-md-2 text-center'>
              <p className='is-size-6'>
                Es un espacio para que puedas compartir una propuesta que mejore el país, tu provincia o tu ciudad. Además, vas a poder comentar los proyectos que estamos  presentando / apoyando / acompañando en la Cámara de Diputados.
              </p>
              <p className='is-size-5 mt-5 mb-2 text-primary'>
                <b>Mirá las distintas formas para participar</b>
              </p>
              <p className='is-size-5 text-primary'>
                <b><i className="fas fa-angle-down fa-2x"></i></b>
              </p>
              {/* <div className="buttons my-4">
                <button
                  className='btn btn-primary btn-lg m-2'
                >
                  <i className="fas fa-microphone"></i> Enviá tu audio a Manes
                </button>
                <br></br>
                <button
                  className='btn btn-primary btn-lg btn-main m-2'
                >
                  <i className="fas fa-check-to-slot"></i>&nbsp;Comentá y votá en las propuestas
                </button>
              </div> */}
            </div>
          </div>
        </div>
        {/* <p className="text-center"><span className="number-round mb-3">1</span></p>
        <p className="text-center mb-4">Compartí tus ideas con Facundo Manes y su equipo</p>
        <div className='about-icons-container'>
          <div className='icon-container'>
            <img
              className='the-icon mx-auto'
              src='/lib/frontend/site/home-multiforum/audio-01.png'
              alt='Graba tu audio' />
            <span>Grabá tu audio</span>
          </div>
          <div className='hidden-sm-down'>
            <i className='fas fa-angle-right fa-2x m-3' />
          </div>
          <div className='hidden-sm-up'>
            <i className='fas fa-angle-down fa-2x m-3' />
          </div>
          <div className='icon-container'>
            <img
              className='the-icon mx-auto'
              src='/lib/frontend/site/home-multiforum/audio-02.png'
              alt='Describila y detallala' />
            <span>Describila y detallala</span>
          </div>
          <div className='hidden-sm-down'>
            <i className='fas fa-angle-right fa-2x m-3' />
          </div>
          <div className='hidden-sm-up'>
            <i className='fas fa-angle-down fa-2x m-3' />
          </div>
          <div className='icon-container'>
            <img
              className='the-icon mx-auto'
              src='/lib/frontend/site/home-multiforum/audio-03.png'
              alt='¡Enviá tu propuesta!' />
            <span>¡Enviá tu propuesta!<br/>El equipo la analizará y te contactará</span>
          </div>
        </div>
        <br />
        <br />
        <p className="text-center"><span className="number-round mb-3">2</span></p>
        <p className="text-center mb-4">Compartí tus ideas con Facundo Manes y su equipo</p>
        <div className='about-icons-container'>
          <div className='icon-container'>
            <img
              className='the-icon mx-auto'
              src='/lib/frontend/site/home-multiforum/icono-informate.png'
              alt='Graba tu audio' />
            <p><b>Informate</b></p>
            <p>Sobre las propuestas existentes</p>
          </div>
          <div className='hidden-sm-down'>
            <i className='fas fa-angle-right fa-2x m-3' />
          </div>
          <div className='hidden-sm-up'>
            <i className='fas fa-angle-down fa-2x m-3' />
          </div>
          <div className='icon-container'>
            <img
              className='the-icon mx-auto'
              src='/lib/frontend/site/home-multiforum/icono-aporta.png'
              alt='Describila y detallala' />
            <p><b>Votá</b></p>
            <p>Las acciones de cada propuesta</p>
          </div>
          <div className='hidden-sm-down'>
            <i className='fas fa-angle-right fa-2x m-3' />
          </div>
          <div className='hidden-sm-up'>
            <i className='fas fa-angle-down fa-2x m-3' />
          </div>
          <div className='icon-container'>
            <img
              className='the-icon mx-auto'
              src='/lib/frontend/site/home-multiforum/icono-propuesta.png'
              alt='¡Enviá tu propuesta!' />
            <p><b>Comentá</b></p>
            <p>Decinos que opinas de las propuestas</p>
          </div>
        </div> */}
        {/* <div className='section-icons'>
          <div className='row'>
            <div className='about-container col-md-4 col-xs-12 mb-4'>
              <img
                className='icon mx-auto'
                src={config.imgs.iconoHomeInformate}
                width='100'
                alt='Informate' />
              <div className='text'>
                <h5>Informate</h5> sobre las consultas disponibles
              </div>
            </div>
            <div className='about-container col-md-4 col-xs-12 mb-4'>
              <img
                className='icon mx-auto'
                src={config.imgs.iconoHomeParticipa}
                width='100'
                alt='Participá' />
              <div className='text'>
                <h5>Participá</h5> en los ejes de las consultas
              </div>
            </div>
            <div className='about-container col-md-4 col-xs-12 mb-4'>
              <img
                className='icon mx-auto'
                src={config.imgs.iconoHomeComparti}
                width='100'
                alt='Proponé' />
              <div className='text'>
                <h5>Proponé</h5> tu opinión, voto o comentario
              </div>
            </div>
          </div>
        </div> */}
      </div>
    )
  }
}

export default BannerHomeAbout
