import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';

const Footer = () => {

  const { logoAndIcons } = useContext(ShopContext);

  const heroImage = (logoAndIcons && Array.isArray(logoAndIcons.data))
    ? logoAndIcons.data.filter(record => record.title === 'main_logo')
      .map(record => record.imageUrl)
    : [];

  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        <div>
          <img className='mb-5 w-32' src={heroImage[0]} alt="" />
          <p className='w-full md:w-2/3 text-gray-600'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industries standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>+91 7757923338</li>
            <li>shivanimethke23@navgurukul.org</li>
          </ul>
        </div>

      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2024@ India.com - All Right Reserved.</p>
      </div>

    </div>
  )
}

export default Footer
