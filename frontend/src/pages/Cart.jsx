import { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContext'
import CartTotal from '../components/CartTotal';

const Cart = () => {

  const { products, currency, navigate, cart, updateQuantity, logoAndIcons } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  const cardData_ = (logoAndIcons && Array.isArray(logoAndIcons.data))
    ? logoAndIcons.data
      .filter(record => record.title === '"star_logo"' || record.title === '"star_dull"')
      .map(record => record.imageUrl)
    : [];

  useEffect(() => {
    const tempData = [];

    // Loop over cart items
    cart.forEach(item => {
      console.log(item,'===');
      
      // Check if the item already exists in tempData
      const existingItemIndex = tempData.findIndex(tempItem => tempItem._id === item._id);

      if (existingItemIndex !== -1) {
        // If it exists, increment the quantity
        tempData[existingItemIndex].quantity += 1;
      } else {
        // If it doesn't exist, add the item with quantity 1
        tempData.push({ ...item, quantity: 1 });
      }
    });

    setCartData(tempData);
  }, [cart]);


  return (
    <div className='border-t pt-14'>

      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        {cartData.map((item, index) => {

          const productData = products.data.find((product) => product._id === item._id);

          return (
            <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
              <div className='flex items-start gap-6'>
                <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />
                <div>
                  <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                  <div className='flex items-center gap-5 mt-2'>
                    <p>{currency}{productData.price}</p>
                    <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                  </div>
                </div>
              </div>
              <input onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' type="number" min={1} defaultValue={item.quantity} />
              <img onClick={() => updateQuantity(item._id, item.size, 0)} className='w-4 mr-4 sm:w-5 cursor-pointer' src={cardData_[12]} alt="" />
            </div>
          )

        })}
      </div>

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className='w-full text-end'>
            <button onClick={() => navigate('/place-order')} className='bg-black text-white text-sm my-8 px-8 py-3'>PROCEED TO CHECKOUT</button>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Cart
