import { FiPhone, FiMessageCircle, FiBell } from "react-icons/fi";

export default function Topbar() {
  return (
    <nav className="flex items-center justify-between h-[76px] shadow-sm border-b px-8 bg-white w-full">
      <div className="flex-1"></div>
      <div className="flex items-center gap-6 text-xl cursor-pointer text-gray-600">
        <FiPhone className="hover:text-indigo-600" />
        <FiMessageCircle className="hover:text-indigo-600" />
        <FiBell className="hover:text-indigo-600" />

        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
          <img
            src="/images/profile.png" 
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </nav>
  );
}
