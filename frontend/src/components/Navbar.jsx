import { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

    const [visible, setVisble] = useState(false);

    const { setShowSearch, getCartCount, logoAndIcons } = useContext(ShopContext);
    const navigate = useNavigate();


    const heroImage = (logoAndIcons && Array.isArray(logoAndIcons.data))
        ? logoAndIcons.data.map(record => record.imageUrl)
        : [];

    // Logout function to call the API
    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3000/user/logout', {
                method: 'POST',
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data);
                alert(data.message); // if you don't use you can comment out
                navigate('/login');
            } else {
                console.log(data);
                alert(data.message);
                navigate('/login');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className='flex items-center justify-between py-5 font-medium' >

            <Link to='/'><img className='w-36' src={heroImage[7]} alt="" /></Link>

            <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
                <NavLink to="/" className='flex flex-col items-center gap-1'>
                    <p>HOME</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/collection' className='flex flex-col items-center gap-1'>
                    <p>COLLECTION</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/about' className='flex flex-col items-center gap-1'>
                    <p>ABOUT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/contact' className='flex flex-col items-center gap-1'>
                    <p>CONTACT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
            </ul>

            <div className='flex items-center gap-6'>
                <img onClick={() => { setShowSearch(true); navigate('/collection') }} className='w-5 cursor-pointer' src={heroImage[2]} alt="" />
                <div className='group relative'>
                    <img onClick={() => { navigate('/login') }} className='w-5 cursor-pointer' src={heroImage[5]} alt="" />

                    {/* Dropdown Menu */}
                    <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                        <div className='flex flex-col gap-2 w-36 py-3 px-5  bg-slate-100 text-gray-500 rounded'>
                            <p onClick={() => { }} className='cursor-pointer hover:text-black'>My Profile</p>
                            <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
                            <p onClick={handleLogout} className='cursor-pointer hover:text-black'>Logout</p> {/* Call handleLogout */}
                        </div>
                    </div>
                </div>
                <Link to='/cart' className='relative'>
                    <img className='w-5 min-w-5' src={heroImage[12]} alt="" />
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
                </Link>
                <img onClick={() => setVisble(true)} className='w-5 cursor-pointer sm:hidden' src={heroImage[13]} alt="" />
            </div>

            {/* Sidebar Menu For Small Screens */}
            <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`} >
                <div className='flex flex-col text-gray-600'>
                    <div onClick={() => setVisble(false)} className='flex items-center gap-4 p-3 '>
                        <img className='h-4 rotate-180' src={heroImage[0]} alt="" />
                        <p>Back</p>
                    </div>
                    <NavLink onClick={() => setVisble(false)} to="/" className='py-2 pl-6 border'>HOME</NavLink>
                    <NavLink onClick={() => setVisble(false)} to='/collection' className='py-2 pl-6 border'>COLLECTION</NavLink>
                    <NavLink onClick={() => setVisble(false)} to='/about' className='py-2 pl-6 border'>ABOUT</NavLink>
                    <NavLink onClick={() => setVisble(false)} to='/contact' className='py-2 pl-6 border'>CONTACT</NavLink>
                </div>
            </div>
        </div>
    )
}

export default Navbar;
