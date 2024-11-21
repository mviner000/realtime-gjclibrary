import NewAttendanceForm from "@/components/attendance/Form/NewAttendanceForm";

export default async function AttendancePage() {
  return (
    <>
      <div className="-mt-2 relative flex h-full min-h-[calc(100vh-80px)] w-full flex-col flex-wrap justify-center gap-8 bg-[url(/images/GenSimeonBldg.jpg)] bg-cover bg-top text-white">
        <div className="absolute z-[1] h-full w-full bg-gradient-to-r from-customGreen via-customGreen/60 to-customGreen/0"></div>
        <NewAttendanceForm />
      </div>
      <div className="bg-black">.</div>
    </>
  );
}
