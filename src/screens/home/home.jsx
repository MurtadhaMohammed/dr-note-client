import React, { useMemo, useState } from "react";
import { UserAddOutlined } from "@ant-design/icons";
import { Select, Button, Empty, Spin, Drawer } from "antd";
import { PatientItem } from "./patientItem/patientItem";
import { PatientForm } from "./patientForm/patinetForm";
import "./home.css";
import { useInfiniteQuery } from "react-query";
import { apiCall } from "../../lib/services";
import LoadMoreBtn from "../../components/loadMoreBtn/loadMoreBtn";
import { useAppStore } from "../../lib/store";
import PatientHistory from "./history/history";
import { useMobileDetect } from "../../hooks/mobileDetect";
import { PatientItemMob } from "./patientItemMob/patientItemMob";

const { Option } = Select;

const HomeScreen = () => {
  const [isModal, setIsModal] = useState(false);
  const [isHistory, setIsHistory] = useState(false);
  const [record, setRecord] = useState(null);
  const { querySearch } = useAppStore();
  const { isMobile } = useMobileDetect();
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

  const PatientCard = isMobile ? PatientItemMob : PatientItem;

  console.log(data, querySearch);

  return (
    <div className="page p-0 sm:p-[24px]">
      {!isMobile && (
        <section className="app-flex">
          <div>
            <span className="mr-1">Patient List for</span>
            <Select popupMatchSelectWidth={false} defaultValue="1" variant={false}>
              <Option value={"1"}>This Day</Option>
              <Option value={"2"}>Last Week</Option>
              <Option value={"3"}>All </Option>
            </Select>
          </div>
          <Button size="large" type="link" onClick={() => setIsModal(true)}>
            + New Patient
          </Button>
        </section>
      )}

      <section className="patients-list mt-0 sm:mt-[12px]">
        <Spin tip="Loading..." spinning={isLoading}>
          {data?.pages?.length > 0 ? (
            data?.pages?.map((item, k) => (
              <PatientCard
                key={k}
                item={item}
                onHistory={(val) => {
                  setRecord(val);
                  setIsHistory(true);
                }}
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
        <button
          onClick={() => setIsModal(true)}
          className="fixed sm:hidden w-[54px] h-[54px] bottom-4 right-4 bg-[#2c24ff] hover:bg-blue-700 text-white font-bold rounded-full shadow-lg"
        >
          <UserAddOutlined className="text-[22px]" />
        </button>
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
        centerted
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
      <Drawer
        title={<span>{record?.name}</span>}
        placement="right"
        closable={true}
        width={400}
        onClose={() => {
          setIsHistory(false);
          setRecord(null);
        }}
        open={isHistory}
      >
        <PatientHistory patientId={record?.id} />
      </Drawer>
    </div>
  );
};
export default HomeScreen;
