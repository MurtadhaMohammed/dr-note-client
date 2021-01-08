import React, { useState, useEffect } from "react";
import { Select, Button, Empty, Spin, Drawer, Row, Col } from "antd";
import { PatientItem, PatientForm } from "../components/home";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { DrugsItem } from "../components/drugs";

const { Option } = Select;

const drugs = [
  { id: 1, name: "New Drug test info", createdAt: 'Nov 20, 2020',color: "#4caf50" },
  { id: 2, name: "New Drug  info", createdAt: 'Nov 20, 2020',color: "#00bcd4" },
  { id: 3, name: "Drug test info", createdAt: 'Nov 20, 2020',color: "#ffc107" },
  { id: 5, name: "New Drug test info", createdAt: 'Nov 20, 2020',color: "#e91e63" },
  { id: 8, name: "New Drug test info", createdAt: 'Nov 20, 2020',color: "#e91e63" },
  { id: 4, name: "Foo Bar Foo YEes", createdAt: 'Nov 20, 2020',color: "#009688" },
  { id: 6, name: "Drug test info", createdAt: 'Nov 20, 2020',color: "#ffc107" },
  { id: 7, name: "Foo Bar Foo YEes", createdAt: 'Nov 20, 2020',color: "#009688" },
  { id: 9, name: "New Drug  info", createdAt: 'Nov 20, 2020',color: "#00bcd4" },
  { id: 10, name: "New Drug  info", createdAt: 'Nov 20, 2020',color: "#00bcd4" },
];
export const DrugsScreen = (props) => {
  useEffect(() => {}, []);

  return (
    <div className="page">
      <section className="app-flex patients-list-header">
        <div>
          <span>Drug List</span>
        </div>
        <Button size="large" type="link">
          + New Drug
        </Button>
      </section>
      <section className="drugs-list">
        <Row gutter={[20, 20]}>
          {drugs.map((item) => (
            <Col key={item.id} md={12} lg={8}>
              <DrugsItem item={item} />
            </Col>
          ))}
        </Row>
      </section>
    </div>
  );
};
