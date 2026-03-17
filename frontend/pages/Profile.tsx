import { BsPersonCircle, BsEnvelope, BsShieldCheck } from 'react-icons/bs';

const Profile = () => {
  return (
    <div className="mx-auto max-w-242.5">
      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="relative z-20 h-35 md:h-65">
          <div className="absolute top-0 left-0 h-full w-full bg-primary/20"></div>
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
            <div className="relative drop-shadow-2 flex h-full w-full items-center justify-center rounded-full bg-gray-2 dark:bg-meta-4">
              <BsPersonCircle size={80} className="text-bodydark2" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              System Administrator
            </h3>
            <p className="font-medium dark:text-bodydark">CFWP Portal Manager</p>
            
            <div className="mx-auto mt-4.5 mb-5.5 grid max-w-94 grid-cols-2 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark">
                <span className="font-semibold text-black dark:text-white text-sm">Role</span>
                <span className="text-xs flex items-center gap-1 text-success"><BsShieldCheck /> Super Admin</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 px-4">
                <span className="font-semibold text-black dark:text-white text-sm">Status</span>
                <span className="text-xs text-primary">Verified</span>
              </div>
            </div>

            <div className="mx-auto max-w-180">
              <h4 className="font-semibold text-black dark:text-white">Contact Information</h4>
              <p className="mt-4.5 flex items-center justify-center gap-2 text-sm dark:text-bodydark">
                <BsEnvelope /> admin@cfwp.gov.rw
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;