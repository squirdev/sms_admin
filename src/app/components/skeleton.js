import { Typography } from "@material-tailwind/react";

const DefaultSkeleton = () => {
  return (
    <div className="max-w-full animate-pulse">
      <Typography
        as="div"
        variant="h1"
        className="h-8 w-36 rounded-full bg-gray-400"
      >
        &nbsp;
      </Typography>
    </div>
  );
};

export default DefaultSkeleton;
