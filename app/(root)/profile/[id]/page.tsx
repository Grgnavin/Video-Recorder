import React from 'react'
import Header from '../../../../components/Header';

const page = async({params}:  ParamsWithSearch) => {
  const { id } =await params;
    return (
    <div className='wrapper page'>
        <Header subHeader='navingrg@gmail.com' title='Navin' userImg='/assets/images/dummy.jpg'  />
        <h1 className='text-2xl font-karla'>User Id: {id}</h1>
    </div>
  )
}

export default page