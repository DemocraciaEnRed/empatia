import React, { Component } from 'react'
import { Link } from 'react-router'
import t from 't-component'
import config from 'lib/config'

export default class Footer extends Component {

  render () {
    return (
      
      <footer className='ext-footer'>
        <img src='/lib/frontend/site/home-multiforum/barritas-colores.png' className='barritas-colores-top' />
        <div className='footer container'>
          <p className="promo">Hecho por <a href="https://democraciaenred.org">Democracia En Red</a></p>
          <div className='institutional'>
            <div className='logo gob'>
              <a href='/'>
                <img src={config.imgs.logoFooter} />
              </a>
            </div>
            <div className="social-media">
              <a href='https://www.facebook.com/Empatia.Ar' target='_blank'><i className="fab mx-2 is-size-4 fa-facebook"></i></a>
              <a href='https://twitter.com/empatia_ar' target='_blank'><i className="fab mx-2 is-size-4 fa-twitter"></i></a>
              <a href='https://www.instagram.com/empatia.ar/' target='_blank'><i className="fab mx-2 is-size-4 fa-instagram"></i></a>
              <a href='https://www.youtube.com/c/EMPATIAar' target='_blank'><i className="fab mx-2 is-size-4 fa-youtube"></i></a>
              <a href='https://t.me/+Gmtm118-QiQ4YTRh' target='_blank'><i className="fab mx-2 is-size-4 fa-telegram"></i></a>
              <a href='https://www.tiktok.com/@empatia.ar' target='_blank'><i className="fab mx-2 is-size-4 fa-tiktok"></i></a>
              <a href='https://open.spotify.com/show/0NMAX9EvgJZgPeEN1288UI?si=ibC_HTFuRjiVlBPjsdU9Zw&nd=1' target='_blank'><i className="fab mx-2 is-size-4 fa-spotify"></i></a>
            </div>
          </div>
          {/* <nav className='menu'>
            <Link to='/ayuda/como-funciona'>¿Cómo funciona?</Link>
            <Link to='/ayuda/acerca'>Acerca de este sitio</Link>
            <Link to='/ayuda/acerca'>Contacto</Link>
          </nav>
          <nav className='menu'>
            <Link to='/ayuda/terminos-y-condiciones'>{ t('help.tos.title')}</Link>
            <Link to='/ayuda/privacidad'>{ t('help.pp.title')}</Link>
          </nav> */}
        </div>
      </footer>
    )
  }
}
