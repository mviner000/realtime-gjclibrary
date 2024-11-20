import { NextPage } from "next";

interface Props {
  children: React.ReactNode;
}

const Gradient: NextPage<Props> = ({ children }) => {
  return (
    <span className="bg-gradient-to-r from-[#00cc66] to-[#00ffd9] bg-clip-text text-transparent">
      {children}
    </span>
  );
};

export default Gradient;
