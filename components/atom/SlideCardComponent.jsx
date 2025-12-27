import Image from 'next/image'
import React from 'react'
import HeadingStyle from './HeadingStyle'

function SlideCardComponent() {
  const uniform = {
    imageUrl: '/assets/images/image 15.jpg',
  }
  return (
    <div className='w-[255px] h-[390px] mr-[10px] flex flex-col items-center justify-center text-center py-[50px]'>
      <Image 
      alt='buy now'
      src={`${uniform.imageUrl}`}
      height={300}
      width={255}
      />
      <HeadingStyle level="15" tag="p" text={'#333333'} >Harris Tweed Three button Jacket</HeadingStyle>
      <HeadingStyle level='15' tag='span' text={'#DD8560'}>$120</HeadingStyle>
    </div>
  )
}

export default SlideCardComponent



