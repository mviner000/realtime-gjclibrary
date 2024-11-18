"use client";
import React, { useState } from "react";
import InputID from "./InputID";
import {
  Attendance,
  StudentInfo,
  Course,
  Gender,
  Role,
} from "@/types/attendanceform";
import axios from "axios";
import { env } from "@/env";
import { format } from "date-fns";
import Image from "next/image";
import ChoosePurpose from "./ChoosePurpose";
import FooterGreetings from "./FooterGreetings";
import Lottie from "react-lottie";
import confettiLottie from "./confetti.json";
import animationLoading from "./cat.json";
import ChooseBaggage from "./ChooseBaggage";

interface CourseShortNames {
  [key: string]: string;
}

const courseShortNames: CourseShortNames = {
  "JUNIOR HIGH SCHOOL": "JHS",
  "Accountancy, Business and Management (ABM)": "ABM",
  "Science, Technology, Engineering and Mathematics": "STEM",
  "Humanities and Social Sciences": "HUMMS",
  "General Academic Strand": "GAS",
  BEEd: "BEEd",
  "BSEd - English": "BSEd-Eng",
  "BSEd - Soc Stud": "BSEdSocS",
  BSA: "BSA",
  BSAIS: "BSAIS",
  BSMA: "BSMA",
  BSIA: "BSIA",
  BSBA: "BSBA",
  "BSBA-FM": "BSBA-FM",
  "BSBA-HRDM": "BSBA-HRDM",
  "BSBA-MM": "BSBA-MM",
  BSIT: "BSIT",
  BSHM: "BSHM",
};

const courses = Object.keys(courseShortNames);

const InputScanner = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [studentDetails, setStudentDetails] = useState<StudentInfo | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [responseData, setResponseData] = useState<Attendance | null>(null);
  const [hasBaggage, setHasBaggage] = useState<boolean | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<string>("");

  const verticalCourses = courses
    .map((course) => courseShortNames[course] || course)
    .map((course) => course.split(""));
  const maxLength = Math.max(...verticalCourses.map((course) => course.length));
  const paddedVerticalCourses = verticalCourses.map((course) => [
    ...course,
    ...Array(maxLength - course.length).fill(""),
  ]);

  const handleScan = async (purpose: string) => {
    setIsSubmitting(true);
    setIsError(false);
    try {
      const dataToSend = {
        school_id: studentDetails?.school_id,
        purpose: purpose,
        status: "time_in",
        has_baggage: hasBaggage,
      };

      console.log("Data being sent:", dataToSend);

      const response = await axios.post<Attendance>(
        `${env.NEXT_PUBLIC_API_URL!}/attendanceV2/`,
        dataToSend
      );

      console.log("Response received:", response.data);

      setResponseData(response.data);
      setCurrentStep(4);

      setTimeout(() => {
        setCurrentStep(1);
        setStudentDetails(null);
        setResponseData(null);
        setHasBaggage(null);
        setSelectedPurpose("");
      }, 2000);
    } catch (error) {
      console.error("Submission error:", error);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultOptionsLoading = {
    loop: true,
    autoplay: true,
    animationData: animationLoading,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultOptionsConfetti = {
    loop: false,
    autoplay: true,
    animationData: confettiLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handlePurposeSelect = (purpose: string) => {
    console.log("Purpose selected:", purpose);
    setSelectedPurpose(purpose);
    setCurrentStep(3);
  };

  const handleBaggageChoice = (hasBaggage: boolean) => {
    const handleSubmission = async () => {
      setIsSubmitting(true);
      setIsError(false);
      try {
        // Log the baggage choice and user details before preparing data
        console.log("Baggage choice details:", {
          hasBaggage,
          userId: studentDetails?.school_id,
          purpose: selectedPurpose,
        });

        const dataToSend = {
          school_id: studentDetails?.school_id,
          purpose: selectedPurpose,
          status: "time_in",
          has_baggage: hasBaggage,
        };

        // Log the complete payload being sent to backend
        console.log("Final submission payload:", {
          url: `${env.NEXT_PUBLIC_API_URL!}/v2/attendance`,
          method: "POST",
          data: dataToSend,
        });

        const response = await axios.post<Attendance>(
          `${env.NEXT_PUBLIC_API_URL!}/v2/attendance`,
          dataToSend
        );

        console.log("Backend response:", response.data);

        setResponseData(response.data);
        setCurrentStep(4);

        setTimeout(() => {
          setCurrentStep(1);
          setStudentDetails(null);
          setResponseData(null);
          setHasBaggage(null);
          setSelectedPurpose("");
        }, 2000);
      } catch (error) {
        console.error("Submission error:", error);
        setIsError(true);
      } finally {
        setIsSubmitting(false);
      }
    };

    setHasBaggage(hasBaggage);
    handleSubmission();
  };

  return (
    <>
      <div className="flex w-full items-end gap-16 px-16 z-10">
        <div className="ml-16 flex w-fit flex-col items-center gap-6">
          {responseData ? (
            <div className="mt-20">
              <div className="hidden absolute top-10 left-16">
                <table className="text-black min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2">Date</th>
                      <th className="border border-gray-300 p-2">Time</th>
                      <th className="border border-gray-300 p-2">Name</th>
                      {paddedVerticalCourses.map((course, index) => (
                        <th
                          key={index}
                          className="pt-2 text-black border border-gray-300 p-0 w-6"
                        >
                          <div className="whitespace-nowrap h-40 flex flex-col items-center justify-start text-xs">
                            {course.map((letter, i) => (
                              <span key={i} className="inline-block">
                                {letter}
                              </span>
                            ))}
                          </div>
                        </th>
                      ))}
                      <th className="border border-gray-300 p-2">
                        Purpose of Visit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="border border-gray-300 p-2 text-sm">
                        {responseData.date}
                      </td>
                      <td className="border border-gray-300 p-2 text-sm">
                        {format(
                          new Date(responseData.time_in_date),
                          "HH:mm:ss"
                        )}
                      </td>
                      <td className="border border-gray-300 p-2 text-sm">
                        {responseData.first_name} {responseData.last_name}
                      </td>
                      {courses.map((course, courseIndex) => (
                        <td
                          key={courseIndex}
                          className="border border-gray-300 p-2 text-sm text-center"
                        >
                          {responseData.course === course ? (
                            <span className="font-bold">✓</span>
                          ) : (
                            <span className="text-white">X</span>
                          )}
                        </td>
                      ))}
                      <td className="border border-gray-300 p-2 text-sm text-center">
                        {responseData.purpose}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-5 border inline-flex items-center justify-center mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 absolute top-30 left-[530px]">
                <div className="w-[520px] px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md animate-fade-in-up">
                  <p className="text-2xl italic">Your Quote for the day:</p>
                  <p className="font-bold text-3xl">
                    {responseData.random_quote.text}
                  </p>
                  <p className="text-lg justify-end text-right">
                    Author: {responseData.random_quote.author}
                  </p>
                  <p className="text-base justify-end text-right">
                    Posted By: {responseData.random_quote.posted_by}
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -bottom-0 right-0 left-80">
                  <Lottie
                    options={defaultOptionsLoading}
                    height={96}
                    width={96}
                  />
                </div>

                <div className="absolute -bottom-0 right-0 left-80">
                  <Lottie
                    options={defaultOptionsConfetti}
                    height={96}
                    width={96}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                WebkitTextStroke: "2px #198835",
              }}
              className="mb-4 font-oswald text-7xl font-bold"
            >
              WELCOME!
            </div>
          )}

          <div className="relative size-[316px]">
            <p className="size-[316px] absolute left-1/2 top-0 z-10 -translate-x-1/2 transform font-oswald text-2xl font-bold">
              {studentDetails?.course === Course.BSIT ? (
                <Image
                  src={"/images/info_tech.png"}
                  fill
                  sizes="30vw"
                  alt="Info Tech"
                />
              ) : studentDetails?.course === Course.BSA ? (
                <Image
                  src={"/images/accountancy.png"}
                  fill
                  sizes="30vw"
                  alt="Accountancy"
                />
              ) : studentDetails?.role === Role.Teacher ? (
                <Image
                  src={"/images/faculty.png"}
                  fill
                  sizes="30vw"
                  alt="Qr green"
                />
              ) : (
                <Image
                  src={"/images/gjchomepagelink.png"}
                  fill
                  sizes="30vw"
                  alt="Qr green"
                />
              )}
            </p>

            {studentDetails?.current_cropped_avatar_url ? (
              <Image
                src={studentDetails.current_cropped_avatar_url}
                fill
                sizes="30vw"
                alt="Student Avatar"
              />
            ) : studentDetails?.gender === Gender.MALE ? (
              <Image
                src={"/images/avatar_male.png"}
                fill
                sizes="30vw"
                alt="Avatar Male"
              />
            ) : studentDetails?.gender === Gender.FEMALE ? (
              <Image
                src={"/images/avatar_female.png"}
                fill
                sizes="30vw"
                alt="Avatar Female"
              />
            ) : (
              <Image
                src={"/images/gjchomepagelink.png"}
                fill
                sizes="30vw"
                alt="Default Avatar"
              />
            )}
          </div>

          <InputID
            studentDetails={studentDetails}
            setCurrentStep={setCurrentStep}
            setStudentDetails={setStudentDetails}
          />
        </div>

        {currentStep === 2 && (
          <ChoosePurpose
            handleScan={handlePurposeSelect}
            isSubmitting={isSubmitting}
          />
        )}

        {currentStep === 3 && (
          <ChooseBaggage
            handleBaggageChoice={handleBaggageChoice}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      <FooterGreetings
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        studentDetails={studentDetails}
        responseData={responseData}
      />
    </>
  );
};

export default InputScanner;
