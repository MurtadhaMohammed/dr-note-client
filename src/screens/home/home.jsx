import React, { useState, useEffect } from "react";
import { Select, Button, Empty, Spin, Drawer } from "antd";
import { PatientItem } from "./patientItem/patientItem";
import { PatientForm } from "./patientForm/patinetForm";
import "./home.css";
import { useInfiniteQuery } from "react-query";
import { apiCall } from "../../lib/services";
import LoadMoreBtn from "../../components/loadMoreBtn/loadMoreBtn";
import { useAppStore } from "../../lib/store";

const { Option } = Select;

const HomeScreen = () => {
  const [isModal, setIsModal] = useState(false);
  const [record, setRecord] = useState(null);
  const { querySearch } = useAppStore();
  const pageSize = 10;

  let searchValue = querySearch?.key === "HOME" ? querySearch?.value : "";

  const fetchPatients = async ({ pageParam = 0 }) => {
    const res = await apiCall({
      url: `patient/v1/all?q=${searchValue}&take=${pageSize}&skip=${pageParam}`,
    });
    return { data: res, nextCursor: pageParam + pageSize };
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["patients", searchValue],
      queryFn: fetchPatients,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      select: (data) => ({
        ...data,
        pages: data.pages.flatMap((page) => page?.data),
        hasNext:
          data.pages.findIndex((el) => el.data.length === 0) === -1
            ? true
            : false,
      }),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  return (
    <div className="page">
      <section className="app-flex">
        <div>
          <span>Patient List for</span>
          <Select defaultValue="1" variant={false}>
            <Option value={"1"}>This Day</Option>
            <Option value={"2"}>Last Week</Option>
            <Option value={"3"}>All </Option>
          </Select>
        </div>
        <Button size="large" type="link" onClick={() => setIsModal(true)}>
          + New Patient
        </Button>
      </section>
      <section className="patients-list">
        <Spin tip="Loading..." spinning={isLoading}>
          {data?.pages?.length > 0 ? (
            data?.pages?.map((item, k) => (
              <PatientItem
                key={k}
                item={item}
                onEdit={(val) => {
                  setRecord(val);
                  setIsModal(true);
                }}
              />
            ))
          ) : (
            <Empty
              style={{ padding: 50 }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Spin>
      </section>

      {data?.pages?.length >= pageSize && (
        <LoadMoreBtn
          loading={isFetchingNextPage}
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => fetchNextPage()}
          isMore={data?.hasNext}
          listLength={data?.pages?.length || 0}
        />
      )}

      <Drawer
        title={<span>New Patient</span>}
        placement="right"
        closable={true}
        width={440}
        onClose={() => {
          setIsModal(false);
          setRecord(null);
        }}
        open={isModal}
      >
        <PatientForm
          record={record}
          open={isModal}
          onClose={() => {
            setIsModal(false);
            setRecord(null);
          }}
        />
      </Drawer>
    </div>
  );
};
export default HomeScreen;
