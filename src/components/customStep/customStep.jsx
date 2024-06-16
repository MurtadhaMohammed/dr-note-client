import "./customStep.css";

const CustomStep = ({ size = 0, current = 0 }) => {
  return (
    <div className="custom-step">
      {[...new Array(size)].map((_, i) => (
        <span className={i === current ? "active" : ""} />
      ))}
    </div>
  );
};

export default CustomStep;
