import React from 'react';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { Link } from 'react-router-dom';
const SuccessVerification: React.FC = () => {
  return (
    <div className="w-1/2 mx-auto flex items-center justify-center h-screen">
      <div className="md:w-1/2 rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="w-full border-stroke dark:border-strokedark xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <IoMdCheckmarkCircle size={'large'} className="text-success" />
              <h2 className=" text-2xl font-bold text-success dark:text-white text-center">
                Email verified!
              </h2>
              <p className="text-black text-center">
                Congratulations!, your email address has been verified
                succesfful.
              </p>
              <div className="text-center mt-3">
                <Link to="/" className="text-blue-600 underline">
                  Click here to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessVerification;
