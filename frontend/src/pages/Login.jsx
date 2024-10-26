import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    // State for managing email and password input values
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currentState, setCurrentState] = useState('Login');
    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        // Define the API endpoint (replace with your actual API URL)
        const apiUrl = currentState === 'Login'
            ? 'http://localhost:3000/user/login'   // Login API
            : 'http://localhost:3000/user/register'; // Signup API

        // Create the request body
        const requestBody = {
            email,
            password
        };

        // Optionally include a name field for signup
        if (currentState === 'Sign Up') {
            requestBody.name = e.target.name.value; // You can get the name from input
        }

        try {
            // Make a POST request to the API
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            // Handle response based on success/failure
            if (response.ok) {
                navigate('/');
            } else {
                console.log(data)
                alert(data.message || 'An error occurred');
            }
        } catch (error) {
            console.error('Error during login/signup:', error);
            alert('There was an error, please try again.');
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                <p className='prata-regular text-3xl'>{currentState}</p>
                <hr className=' border-none h-[1.5px] w-8 bg-gray-800' />
            </div>
            {/* Show the name input only for Signup */}
            {currentState === 'Login' ? null : <input name='name' className='w-full px-3 py-2 border border-gray-800' type="text" placeholder='Name' required />}
            {/* Email Input */}
            <input
                className='w-full px-3 py-2 border border-gray-800'
                type="email"
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            {/* Password Input */}
            <input
                className='w-full px-3 py-2 border border-gray-800'
                type="password"
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <div className='w-full flex justify-between text-sm mt-[-8px]'>
                <p className='cursor-pointer'>Forgot your password?</p>
                {
                    currentState === 'Login'
                        ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create account</p>
                        : <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login here</p>
                }
            </div>
            <button type='submit' className='bg-black text-white font-light px-8 py-2 mt-4'>
                {currentState === 'Login' ? 'Sign in' : 'Sign up'}
            </button>
        </form>
    );
};

export default Login;
