import React from 'react'
import './Header.css'   
import { assets } from '../../assets/assets'

const Header = () => {
  return (
    <div className='header'>
        <div className="header-contents">
            <h2>Our Menu</h2>
            <p>
                Explore a variety of fresh, tasty, and affordable meals made with quality ingredients. Perfect for quick bites or relaxed dining with friends.
            </p>
            <button className="explore-btn">Explore Menu</button>
        </div>
    </div>
  )
}

export default Header