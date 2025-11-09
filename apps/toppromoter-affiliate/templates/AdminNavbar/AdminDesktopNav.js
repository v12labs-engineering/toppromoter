import { AdminNavItems } from '@/templates/AdminNavbar/AdminNavItems';

export const AdminDesktopNav = () => {
  return(
    <div className="hidden lg:flex lg:flex-shrink-0  group transition duration-500 border-r-2 border-gray-100">
      <div className="flex flex-col transition-all duration-200">
        <div className="flex flex-col flex-grow overflow-y-hidden">
          <AdminNavItems />
        </div>
      </div>
    </div>
  )
};

export default AdminDesktopNav;