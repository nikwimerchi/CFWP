// frontend/src/pages/authentication/SignIn.tsx

import axios from 'axios';
import React, { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { BACKEND_URL } from '../../../utils/constants';
import { errorHandler } from '../../../utils/toast';
import { IUser } from '../../../types/user'; // Assume IUser type
import { useDispatch } from 'react-redux';
import { setUser } from '../../../redux/actions/user'; // Assume setUser action
import PageLoader from '../../../components/page-loader';

interface ILoginResponse {
  user: IUser;
  token: string;
}

const SignIn: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook for redirection
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      // POST to backend /auth/login
      const response = await axios.post(BACKEND_URL + '/auth/login', {
        email,
        password,
      });
      
      // Success: Dispatch user to Redux store
      const { user, token } = response.data as ILoginResponse;
      dispatch(setUser({ ...user, token }));
      
      // Redirect to dashboard on successful login
      navigate('/dashboard'); 
      
      setEmail('');
      setPassword('');
      setIsLoading(false);
      
    } catch (error) {
      setIsLoading(false);
      errorHandler(error); // Use your centralized error handler for feedback
    }
  };
  return (
    // ... (JSX remains the same as provided earlier) ...
    <div className="w-[90%] md:w-1/2 mx-auto flex items-center justify-center h-screen">
      <div className="w-full md:w-[50%] rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="w-full border-stroke dark:border-strokedark xl:border-l-2">
            <div className="w-full p-8">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
                Sign In
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      required
                      value={email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                      type="email"
                      placeholder="Enter your email"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4">
                      {/* SVG for email icon */}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      disabled={isLoading}
                      value={password}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter your password"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4">
                      {/* SVG for password icon */}
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  <input
                    type="submit"
                    disabled={isLoading}
                    value={isLoading ? 'Signing in...' : 'Sign In'}
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>

                <div className="mt-6 text-center">
                  <p>
                    Don’t have any account?{' '}
                    <Link to="/signup" className="text-primary">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <PageLoader open={isLoading} />
    </div>
  );
};

export default SignIn;