import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
  return (
    <div className='footer' id='Footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo} alt="" className="footer-logo" />
                <p>Welcome to DYP Cafeteria – your go-to place for fresh, delicious, and hygienic meals.We serve a variety of snacks, beverages, and full meals prepared with quality ingredients to keep you energized throughout the day.</p>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
                    
                </div>
            </div>
            <div className="footer-content-center">
                <h2>CAFETERIA</h2>
                <ul>
                   <li>Home</li>
                   <li>About us</li>
                   <li>Privacy policy</li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>dypcafeteria21@gmail.com</li>
                    <li>+91 73562 94310</li>
                </ul>
            </div>
            
        </div>
        <hr />
        <p className='footer-copyright'>Copyright 2026 © DYP_CAFETERIA.com - All Rights Reserved </p>

    </div>
  )
}

export default Footer