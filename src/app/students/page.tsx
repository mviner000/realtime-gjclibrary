import AccountSearch from "@/components/AccountSearch";
import UuidSearch from "@/components/wrappers/UuidSearch";

const StudentsPage: React.FC = async () => {
  return (
    <div>
      <AccountSearch />
      {/* <UuidSearch /> */}
    </div>
  );
};

export default StudentsPage;
