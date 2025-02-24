import { Button, Drawer, Sidebar, TextInput } from "flowbite-react";
import { useState } from "react";
import {
  HiChartPie,
  HiClipboard,
  HiCollection,
  HiInformationCircle,
  HiLogin,
  HiPencil,
  HiSearch,
  HiShoppingBag,
  HiUsers,
} from "react-icons/hi";
import { FaAlignJustify } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function AdminDrawer(){
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => setIsOpen(false);
  
    return (
      <>
        <div className="flex items-center justify-center">
          <Button onClick={() => setIsOpen(true)} className='bg-gray-900'>
            <FaAlignJustify />
          </Button>
        </div>
        <Drawer open={isOpen} onClose={handleClose}>
          <Drawer.Header title="MENU" titleIcon={() => <></>} />
          <Drawer.Items>
            <Sidebar
              aria-label="Sidebar with multi-level dropdown example"
              className="[&>div]:bg-transparent [&>div]:p-0"
            >
              <div className="flex h-full flex-col justify-between py-2">
                <div>
                  <form className="pb-3 md:hidden">
                    <TextInput icon={HiSearch} type="search" placeholder="Search" required size={32} />
                  </form>
                  <Sidebar.Items>
                    <Sidebar.ItemGroup>
                      <Sidebar.Item href="/" icon={HiChartPie}>
                        Dashboard
                      </Sidebar.Item>
                      <Sidebar.Item href="/e-commerce/products" icon={HiShoppingBag}>
                        Products
                      </Sidebar.Item>
                      <Sidebar.Item icon={HiUsers}>
                        <Link to='/users'>Users list</Link>                        
                      </Sidebar.Item>
                      <Sidebar.Item href="/authentication/sign-in" icon={HiLogin}>
                        Sign in
                      </Sidebar.Item>
                      <Sidebar.Item href="/authentication/sign-up" icon={HiPencil}>
                        Sign up
                      </Sidebar.Item>
                    </Sidebar.ItemGroup>
                    <Sidebar.ItemGroup>
                      <Sidebar.Item href="https://github.com/themesberg/flowbite-react/" icon={HiClipboard}>
                        Docs
                      </Sidebar.Item>
                      <Sidebar.Item href="https://flowbite-react.com/" icon={HiCollection}>
                        Components
                      </Sidebar.Item>
                      <Sidebar.Item href="https://github.com/themesberg/flowbite-react/issues" icon={HiInformationCircle}>
                        Help
                      </Sidebar.Item>
                    </Sidebar.ItemGroup>
                  </Sidebar.Items>
                </div>
              </div>
            </Sidebar>
          </Drawer.Items>
        </Drawer>
      </>
    );
}