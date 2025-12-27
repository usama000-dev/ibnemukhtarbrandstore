import Image from 'next/image'
import React from 'react'
import HeadingStyle from './HeadingStyle'

function HomeCardComponent() {
  const uniform = {
    imageUrl: '/assets/images/image 15.jpg',
  }
  return (
    <div className='w-[165px] h-[260.16px] mt-[30px] flex flex-col items-center justify-center text-center'>
      <Image 
      alt='uniform image'
      src={`${uniform.imageUrl}`}
      height={200}
      width={165}
      />
      <HeadingStyle level="14" tag="p" >21WN reversible angora cardigan</HeadingStyle>
      <HeadingStyle level='7' tag='span'>$120</HeadingStyle>
    </div>
  )
}

export default HomeCardComponent
