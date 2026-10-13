import React from 'react'

const CheckPage = ({data}) => {
  return (
    <div className='h-screen w-full flex justify-center items-center text-2xl font-bold text-white'>
        <button className='bg-[#ff4d6d] px-4 py-2 rounded-lg hover:bg-[#ff1a3c] transition-colors duration-300'>
            <a href={data?.url} target="_blank" rel="noopener noreferrer">
                Click
            </a>
        </button>
    </div>
  )
}

export default CheckPage