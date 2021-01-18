import React, { useState, useEffect } from "react";
import { Select, Button, Empty, Spin, message, Row, Col } from "antd";
import { PatientItem, PatientForm } from "../components/home";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { DrugForm, DrugsItem } from "../components/drugs";
import { createDrug, getDrug } from "../db/controllers";
import { DrugStore } from "../store/drugStore";

const { Option } = Select;

// const drugs = [
//   { id: 1, name: "New Drug test info", createdAt: 'Nov 20, 2020', color: "#4caf50" },
//   { id: 2, name: "New Drug  info", createdAt: 'Nov 20, 2020', color: "#00bcd4" },
//   { id: 3, name: "Drug test info", createdAt: 'Nov 20, 2020', color: "#ffc107" },
//   { id: 5, name: "New Drug test info", createdAt: 'Nov 20, 2020', color: "#e91e63" },
//   { id: 8, name: "New Drug test info", createdAt: 'Nov 20, 2020', color: "#e91e63" },
//   { id: 4, name: "Foo Bar Foo YEes", createdAt: 'Nov 20, 2020', color: "#009688" },
//   { id: 6, name: "Drug test info", createdAt: 'Nov 20, 2020', color: "#ffc107" },
//   { id: 7, name: "Foo Bar Foo YEes", createdAt: 'Nov 20, 2020', color: "#009688" },
//   { id: 9, name: "New Drug  info", createdAt: 'Nov 20, 2020', color: "#00bcd4" },
//   { id: 10, name: "New Drug  info", createdAt: 'Nov 20, 2020', color: "#00bcd4" },
// ];
const colors = ['#008891', '#ef4f4f', '#ff9a00', '#1fab89', '#d72323', '#0c056d'];
const randomColor= (colors)=>{
  return colors[Math.floor((Math.random()*colors.length))];
}
export const DrugsScreen = (props) => {

  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  const [addLoading, setAddLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  let {
    name,
    color,
    setName,
    setColor
  } = DrugStore();

  useEffect(() => {
    loadData();
  }, [page]);
  // useEffect(() => {}, []);
  const loadData = () => {
    setLoading(true);
    getDrug(page, (result) => {
      if (result.status) {
        setLoading(false);
        setData(result.drugs);
        setCount(result.total);
        setPages(result.pages);
      }
    });
  };


  const addDrug = () => {
    color= randomColor(colors);
    let data = { name, color };
    // console.log(data);
    createDrug(data, (status) => {
      if (status) {
        // console.log(data);
        setAddLoading(false);
        setName(null);
        setColor(null);
        loadData();
        message.success("Insert successfully .");
      } else {
        setAddLoading(false);
        message.error("The process is not complete!");
      }
    });
  };

  return (
    <div className="page">
      <section className="app-flex patients-list-header">
        <div>
          <span>Drug List</span>
        </div>
        <Button size="large" type="link" onClick={() => setIsModalVisible(true)}>
          + New Drug
        </Button>
      </section>
      <section className="drugs-list">
        <Row gutter={[20, 20]}>
          {data.map((item) => (
            <Col key={item.id} md={12} lg={8}>
              <DrugsItem item={item} />
            </Col>
          ))}
        </Row>
      </section>
      <DrugForm visible={isModalVisible} loading={addLoading} onSubmit={addDrug} onClose={() => setIsModalVisible(false)} />
    </div>
  );
};
