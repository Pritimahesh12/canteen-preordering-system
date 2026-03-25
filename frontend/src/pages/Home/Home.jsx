import React, { useState } from 'react'
import Header from '../../components/Header/Header'  
import './home.css'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'

const Home = () => {
  //which food category is selected by the user
  const [category, setCategory] = useState("All");

  return (
    <div>
        <Header />  
        <ExploreMenu category={category} setCategory={setCategory} />
        <FoodDisplay category={category}/>   
    </div>
  )
}

export default Home