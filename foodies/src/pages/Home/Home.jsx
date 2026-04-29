import React from 'react'
import Headers from '../../components/Header/Header';
import ExploerMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import { useState } from 'react';



export default function Home() { 

  const [category, setCategory] =useState('All');
  return (
  <main className='container'>
    <Headers />
    <ExploerMenu category={category} setCategory={setCategory} />
    <FoodDisplay category={category} searchText='' />
    
  </main>
  )
}
