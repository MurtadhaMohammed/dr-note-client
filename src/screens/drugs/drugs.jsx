import React, { useState, useEffect } from "react";
import { Button, Row, Col, Empty, Spin } from "antd";
import { DrugForm } from "./drugModal/drugModal";
import { DrugsItem } from "./drugItem/drugsItem";
import "./drugs.css";
import { apiCall } from "../../lib/services";
import { useInfiniteQuery } from "react-query";
import { useAppStore } from "../../lib/store";
import LoadMoreBtn from "../../components/loadMoreBtn/loadMoreBtn";
import { useMobileDetect } from "../../hooks/mobileDetect";
import { AppstoreAddOutlined } from "@ant-design/icons";

const DrugsScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { querySearch } = useAppStore();
  const { isMobile } = useMobileDetect();
  const pageSize = 21;

  let searchValue = querySearch?.key === "drugs" ? querySearch?.value : "";

  const fetchDrugs = async ({ pageParam = 0 }) => {
    const res = await apiCall({
      url: `drug/v1/all?q=${searchValue}&take=${pageSize}&skip=${pageParam}`,
    });
    return { data: res, nextCursor: pageParam + pageSize };
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["drugs", searchValue],
      queryFn: fetchDrugs,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      select: (data) => ({
        ...data,
        pages: data.pages.flatMap((page) => page?.data),
        hasNext:
          data.pages.findIndex((el) => el.data.length === 0) === -1
            ? true
            : false,
      }),
      refetchOnWindowFocus: false,
    });

  return (
    <div className="drug-screen p-[16px] sm:p-[24px]">
      {!isMobile && (
        <section className="app-flex">
          <div>
            <span>Drug List</span>
          </div>
          <Button
            size="large"
            type="link"
            onClick={() => setIsModalVisible(true)}
          >
            + New Drug
          </Button>
        </section>
      )}
      <section className="mt-0 sm:mt-[14px]">
        <Spin tip="Loading..." spinning={isLoading}>
          {data?.pages?.length > 0 ? (
            <Row gutter={[20, 20]}>
              {data?.pages?.map((item) => (
                <Col key={item.id} xs={24} md={12} lg={8}>
                  <DrugsItem item={item} />
                </Col>
              ))}
            </Row>
          ) : (
            <Empty
              style={{ padding: 50 }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Spin>
        <button
          onClick={() => setIsModalVisible(true)}
          class="fixed sm:hidden w-[54px] h-[54px] bottom-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg"
        >
          <AppstoreAddOutlined className="text-[22px]" />
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
      <DrugForm
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </div>
  );
};

export default DrugsScreen;
