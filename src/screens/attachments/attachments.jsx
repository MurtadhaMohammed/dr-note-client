import React, { useState } from "react";
import { Select, Button, Empty, Spin, Row, Col, Modal } from "antd";
import { AttachmentItem } from "./attachmentItem/attachmentItem";
import "./attachments.css";
import { useInfiniteQuery } from "react-query";
import { apiCall } from "../../lib/services";
import { useAppStore } from "../../lib/store";
import LoadMoreBtn from "../../components/loadMoreBtn/loadMoreBtn";
import AttachmentForm from "./attachmentForm/attachmentForm";

const { Option } = Select;

const AttachmentsScreen = () => {
  const [isNew, setIsNew] = useState(false);
  const { querySearch } = useAppStore();
  const pageSize = 20;

  let searchValue =
    querySearch?.key === "attachements" ? querySearch?.value : "";

  const fetchPatients = async ({ pageParam = 0 }) => {
    const res = await apiCall({
      url: `file/v1/all?q=${searchValue}&take=${pageSize}&skip=${pageParam}`,
    });
    return { data: res, nextCursor: pageParam + pageSize };
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["files", searchValue],
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
      refetchOnWindowFocus: false,
    });

  return (
    <div className="page">
      <section className="app-flex">
        <div>
          <span>List of Attachments for</span>
          <Select defaultValue="1" variant={false}>
            <Option value={"1"}>This Day</Option>
            <Option value={"2"}>Last Week</Option>
            <Option value={"3"}>All </Option>
          </Select>
        </div>
        <Button size="large" type="link" onClick={() => setIsNew(true)}>
          + New File
        </Button>
      </section>
      <section className="attachment-list">
        <Spin tip="Loading..." spinning={isLoading}>
          {data?.pages?.length > 0 ? (
            <Row gutter={[20, 20]}>
              {data?.pages?.map((item) => (
                <Col key={item.id} md={12} lg={8}>
                  <AttachmentItem item={item} />
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

      <Modal
        open={isNew}
        onCancel={() => setIsNew(false)}
        centered
        title="New File"
        width={400}
        footer={null}
        destroyOnClose
      >
        <AttachmentForm onClose={() => setIsNew(false)} />
      </Modal>
    </div>
  );
};

export default AttachmentsScreen;
