import { Button, Space } from "antd";
import { FaUserInjured, FaClipboardList, FaFlask, FaFileInvoice, FaDollarSign } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { MdDateRange } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { useAppStore } from "../../lib/store";
import { MenuMob } from "./menu";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

export const HeaderMob = () => {
  const [isMenu, setIsMenu] = useState(false);
  const location = useLocation();
  const { querySearch, setQuerySearch } = useAppStore();
  const [searchQuery, setSearchQuery] = useState(querySearch?.value || "");

  const { selectedName, isScroll } = useAppStore();
  let page = "/" + location.pathname.split("/")[1];

  const handleSearch = (v) => {
    setSearchQuery(v);
        let key;
    switch (page) {
      case "/schedule":
        key = "schedule";
        break;
      case "/patients":
        key = "patients";
        break;
      case "/attachements":
        key = "attachements";
        break;
      case "/drugs":
        key = "drugs";
        break;
      case "/Invoice":
        key = "invoice";
        break;
      case "/expenses":
        key = "expenses";
        break;
      default:
        key = "HOME";
    }
  
    setQuerySearch({ key, value: v });
  };
  
  const titles = [
    {
      key: "/",
      title: (
        <Space size={8}>
          <FaUserInjured size={18} />
          <b className="text-[20px]">Patients</b>
        </Space>
      ),
    },
    {
      key: "/patients",
      title: (
        <Space size={8}>
          <Button onClick={() => history.back()} type="text" icon={<IoIosArrowBack size={24} />} />
          <b className="text-[20px]">{selectedName}</b>
        </Space>
      ),
      child: true,
    },
    {
      key: "/schedule",
      title: (
        <Space size={8}>
          <MdDateRange size={18} />
          <b className="text-[20px]">Schedule</b>
        </Space>
      ),
    },
    {
      key: "/attachements",
      title: (
        <Space size={8}>
          <FaClipboardList size={18} />
          <b className="text-[20px]">Attachments</b>
        </Space>
      ),
    },
    {
      key: "/drugs",
      title: (
        <Space size={8}>
          <FaFlask size={18} />
          <b className="text-[20px]">Drugs</b>
        </Space>
      ),
    },
    {
      key: "/Invoice",
      title: (
        <Space size={8}>
          <FaFileInvoice size={18} />
          <b className="text-[20px]">Invoice</b>
        </Space>
      ),
    },
    {
      key: "/expenses",
      title: (
        <Space size={8}>
          <FaDollarSign size={18} />
          <b className="text-[20px]">Expenses</b>
        </Space>
      ),
    },
  ];

  return (
    <div
      className="block left-0 right-0 top-0 z-10 lg:hidden  p-[16px] bg-white border border-b-[#eee] transition-all"
      style={{
        height: 120
      }}
    >
      <div className="flex items-center justify-between">
        {titles?.find((el) => el.key === page)?.title}
        <Button className="flex items-center justify-center" type="text" onClick={() => setIsMenu(true)} icon={<IoMenu size={28} />} />
      </div>
      {!titles?.find((el) => el.key === page)?.child && (
        <div
        className="flex items-center justify-between bg-[#f6f6f6] border border-[#f6f6f6] h-[48px] rounded-[8px] py-[6px] px-[16px] mt-[12px] mb-[16px] transition-all"
      >
        <input
          className="bg-[#f6f6f6] w-full text-[18px] outline-0"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearch(e.target.value);
          }}
        />
        {searchQuery && (
          <IoClose
            className="text-gray-400 cursor-pointer"
            size={22}
            onClick={() => {
              setSearchQuery('');
              handleSearch('');
            }}
          />
        )}
        {!searchQuery && (
          <FiSearch className="opacity-40 cursor-pointer" size={22} onClick={() => handleSearch(searchQuery)} />
        )}
      </div>
      )}
      <MenuMob open={isMenu} onClose={() => setIsMenu(false)} page={page} />
    </div>
  );
};
