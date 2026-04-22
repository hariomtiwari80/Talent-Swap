import { useContext } from 'react'
import { assets } from '../assets/assets'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {

    const { openSignIn } = useClerk()
    const { user } = useUser()
    const navigate = useNavigate()
    const { setShowRecruiterLogin } = useContext(AppContext)

    return (
        <div className='shadow h-16 flex items-center bg-white'>
            <div className='max-w-7xl w-full mx-auto px-4 flex justify-between items-center'>

                {/* Logo */}
                <img 
                    onClick={() => navigate('/')} 
                    className='cursor-pointer h-12 sm:h-14 object-contain' 
                    src={assets.logo} 
                    alt="logo" 
                />

                {
                    user
                        ? (
                            <div className='flex items-center gap-3 text-sm'>
                                <Link to='/applications'>Applied Jobs</Link>
                                <p>|</p>
                                <p className='max-sm:hidden'>
                                    Hi, {user.firstName + " " + user.lastName}
                                </p>
                                <UserButton />
                            </div>
                        )
                        : (
                            <div className='flex items-center gap-3 text-sm'>
                                <button 
                                    onClick={() => setShowRecruiterLogin(true)} 
                                    className='text-gray-600'
                                >
                                    Recruiter Login
                                </button>

                                <button 
                                    onClick={() => openSignIn()} 
                                    className='bg-blue-600 text-white px-5 py-1.5 rounded-full'
                                >
                                    Login
                                </button>
                            </div>
                        )
                }

            </div>
        </div>
    )
}

export default Navbar