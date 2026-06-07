import { BarLoader } from 'react-spinners';

const override: React.CSSProperties = {
  display: 'block',
  margin: '0 auto',
};

interface SpinnerProps {
  color?: string;
  width?: string | number;
  height?: string | number;
}

const Spinner = ({ color = 'blue', width = 150, height = 4 }: SpinnerProps) => {
  return (
    <div>
      <BarLoader
        color={color}
        cssOverride={override}
        width={width}
        height={height}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Spinner;