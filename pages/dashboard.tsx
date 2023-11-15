import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from "react-redux";
import {
    toggleProfileDropdown,
    toggleModal,
    deleteAccount,
    DashboardState,
} from '../components/dashboardSlice';
import { setToken } from "../components/authSlice";
import Modal from 'react-modal';
import { AppDispatch, RootState } from "../store/store";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);
  const {
    isProfileDropdownVisible,
    isModalOpen,
  } = useSelector((state: RootState) => state.dashboard as DashboardState);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    dispatch(setToken(null));
    router.push('/login');
    dispatch(toggleProfileDropdown(false));
  };

  const handleDeleteAccount = async () => {
    dispatch(toggleModal(true));
  };

  const closeModal = () => {
    dispatch(toggleModal(false));
  };

  const confirmDeleteAccount = async () => {
    dispatch(deleteAccount())
    dispatch(toggleModal(false));
    router.push('/register');
  }

  return (
    <div className="fixed w-full z-50">
      <div className="bg-green-300 lg:py-2.5 py-1">
          <div className="lg:w-1/3 flex justify-around items-center mx-auto">
              <Link href='/' legacyBehavior><a className="text-neutral-900 hover:text-green-800 lg:text-lg text-sm transition-colors">Home</a></Link>
              <Link href='/forum' legacyBehavior><a className="text-neutral-900 hover:text-green-800 lg:text-lg text-sm transition-colors">Forum</a></Link>
            {!token &&
              <>
                <div>
                  <Link href='/register' legacyBehavior><a className="text-neutral-900 hover:text-green-800 lg:text-lg text-sm transition-colors">Register</a></Link>
                </div>
                <div>
                  <Link href='/login' legacyBehavior><a className="text-neutral-900 hover:text-green-800 lg:text-lg text-sm transition-colors">Login</a></Link>
                </div>
              </>
              }
              {token && (
                <div className="relative flex items-center transition-colors duration-300 ease-in-out"
                  onMouseEnter={() => dispatch(toggleProfileDropdown(true))}
                  onMouseLeave={() => dispatch(toggleProfileDropdown(false))}>
                  <Link href='/accountSettings' legacyBehavior><a className="text-neutral-900 hover:text-green-800 lg:text-lg text-sm transition-colors">Account Settings</a></Link>
                  {isProfileDropdownVisible && (
                    <div className="bg-green-300 absolute left-1/2 transform -translate-x-1/2 lg:mt-32 mt-16 lg:text-lg text-sm whitespace-nowrap z-5 flex flex-col rounded-md justify-center items-center lg:pb-5">
                      <button onClick={handleDeleteAccount} className="text-neutral-900 hover:text-green-800 lg:px-4 lg:pt-4 px-1">Delete Account</button>
                      <button onClick={handleLogout} className="text-neutral-900 hover:text-green-800 lg:px-4 lg:pt-4 px-1">Logout</button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <Modal
              isOpen={isModalOpen}
              onRequestClose={closeModal}
              className="absolute lg:top-20 lg:left-12 top-10 left-4 h-28 w-auto bg-green-300 lg:p-8 p-4 lg:shadow-lg shadow-sm z-10 lg:rounded-xl rounded-lg"
              overlayClassName="content-none"
            >
              <h2 className="text-neutral-950 lg:text-lg lg:mx-8 text-sm text-center mx-2">Are You Sure?</h2>
              <div className="flex justify-between lg:mt-5 mt-2">
                <button onClick={confirmDeleteAccount} className="delete-button">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  Yes
                </button>
                <button onClick={closeModal} className="update-button">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  No
                </button>
              </div>
            </Modal>
        </div>
      </div>
  );
};

export default Dashboard;