import { useInfiniteQuery } from "react-query";
import "./history.css";
import { apiCall } from "../../../lib/services";
import { Card, Divider, Empty, Space, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { IoTimeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const PatientHistory = ({ patientId }) => {
  const navigate = useNavigate();

  const pageSize = 10;
  const fetchHistory = async ({ pageParam = 0 }) => {
    const res = await apiCall({
      url: `visit/v1/all/${patientId}?take=${pageSize}&skip=${pageParam}`,
    });
    return { data: res, nextCursor: pageParam + pageSize };
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [`visit-${patientId}`, patientId],
      queryFn: fetchHistory,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      select: (data) => ({
        ...data,
        pages: data.pages.flatMap((page) => page?.data),
        hasNext:
          data.pages.findIndex((el) => el.data.length === 0) === -1
            ? true
            : false,
      }),
      // refetchOnMount: false,
      // refetchOnWindowFocus: false,
      enabled: !!patientId,
    });

  return (
    <div className="patient-history">
      {data?.pages?.length > 0 ? (
        data?.pages?.map((item, k) => (
          <Card
            size="small"
            key={k}
            style={{ marginBottom: 8 }}
            styles={{ body: { borderRadius: 4 } }}
            hoverable
            onClick={() => navigate(`/patients/${patientId}/visit/${item.id}`)}
          >
            <Space align="center">
              <IoTimeOutline size={18} style={{ marginBottom: "-3px" }} />
              <Typography.Text>
                {dayjs(item.createdAt).format("YYYY , dddd MM  hh:mm A")}
              </Typography.Text>
            </Space>
            <Divider style={{ margin: "8px 0px" }} />
            <div className="patient-history-note">
              <Typography.Text type="secondary">
                {item?.note || "...."}
              </Typography.Text>
            </div>
            <Space wrap>
              {item?.drugs?.map((drug) => (
                <Tag color="magenta">{drug?.name}</Tag>
              ))}
            </Space>
          </Card>
        ))
      ) : (
        <Empty
          style={{ marginTop: "30vh" }}
          image={Empty.PRESENTED_IMAGE_DEFAULT}
        />
      )}
    </div>
  );
};

export default PatientHistory;
