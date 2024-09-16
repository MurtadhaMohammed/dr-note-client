import React, { useState } from "react";
import { Input } from "antd";
import { LuSearch } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { useAppStore } from "../../lib/store";
import "./searchBox.css";

const SearchBox = ({ page }) => {
  const { querySearch, setQuerySearch } = useAppStore();
  const [val, setVal] = useState(null);

  let { value = "" } = querySearch;

  console.log(page, 'page in search box');

  return (
    <div className="search-box">
      {value ? (
        <div
          // className={`x-icon x-icon-active`}
          onClick={() => {
            setQuerySearch({});
            setVal(null);
          }}
        >
          <IoClose size={24} />
        </div>
      ) : (
        <div
          // className={`x-icon ${val ? "x-icon-active" : ""} handleSearch`}
          onClick={() => {
            setQuerySearch({ key: page, value: val });
          }}
        >
          <LuSearch size={22} style={{ color: val ? "#000" : "#ccc", cursor: "pointer", transition: "0.2s" }} />
        </div>
      )}

      <Input.Search
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onSearch={(v) => setQuerySearch({ key: page, value: v })}
        placeholder="Search for list . . ."
      />
    </div>
  );
};

export default SearchBox;
