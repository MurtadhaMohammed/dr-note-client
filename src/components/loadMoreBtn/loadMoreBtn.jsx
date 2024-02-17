import { Button, Typography } from "antd";
import "./loadMoreBtn.css";

const LoadMoreBtn = ({ loading, disabled, onClick, isMore, listLength }) => {
  return (
    <div className="load-more-btn">
      {isMore ? (
        <Button
          onClick={onClick}
          disabled={disabled}
          loading={loading}
          type="link"
        >
          Load More Data
        </Button>
      ) : (
        listLength !== 0 && (
          <Typography.Text type="secondary">
            Nothing more to load
          </Typography.Text>
        )
      )}
    </div>
  );
};

export default LoadMoreBtn;
