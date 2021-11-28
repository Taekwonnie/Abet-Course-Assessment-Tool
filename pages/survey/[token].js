//imports
import { useState, useContext, useEffect } from "react";
import Head from "next/head";
import { Text, VStack, Button, Box } from "@chakra-ui/react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import cookieCutter from "cookie-cutter";
import Navigation from "../../components/Navigation";
//hooks
import useToggle from "../../hooks/useToggle";

//components
import StudentLoginBox from "../../components/survey-components/StudentLoginBox";
import StudentInfoForm from "../../components/survey-components/StudentInfoForm";
import CourseOutcomesSurvey from "../../components/survey-components/CourseOutcomesSurvey";
import TAsurvey from "../../components/survey-components/TAsurvey";
import StudentFeedback from "../../components/survey-components/StudentFeedback";
//page data
import {
  PageContext,
  pageData,
} from "../../components/survey-components/SurveyPageData";
//api
import { postStudentSurvey } from "../../api/APIHelper";
const studentSurvey = () => {
  const context = useContext(PageContext);
  const course = context.course;
  const router = useRouter();

  const pathname = router.pathname;
  let relativeURL = "";
  const ISSERVER = typeof window === "undefined";
  let role = "";
  if (!ISSERVER) {
    const token = cookieCutter.get("token");
    var surveyToken = router.query.token;
    if (!surveyToken) {
      return <></>;
    }
    if (surveyToken) {
      relativeURL = router.pathname.replace("[token]", surveyToken);
    } else {
      relativeURL = router.pathname;
    }
    //console.log("Survey Token " + surveyToken);
    //console.log("Relative URL " + relativeURL);
    if (!token) {
      router.push({
        pathname: "/Login",
        query: { from: relativeURL },
      });
    }

    const json = jwt.decode(token);
    if (json == null) {
      role = "null";
    } else {
      role = json.role;
    }
    //console.log("Role from survey:" + role);
    if (role == "null") {
      console.log("Push");
      router.push({
        pathname: "/Login",
        query: { from: relativeURL },
      });
    }
  }

  //state
  const [courseInformation, setCourseInformation] = useState({
    courseNumber: "",
    courseSemester: "",
    courseYear: "",
    courseDisplayName: "",
    courseDepartment: "",
  });

  const [isLoggedIn, toggleLogin] = useToggle(true);
  const [studentInformation, setStudentInformation] = useState({
    major: "",
    classification: "",
    grade: "",
  });
  const [outcomeSurvey, setOutcomeSurvey] = useState(
    context.course["course-outcomes"]
  );
  const [TAquestions, setTAquestions] = useState(context.questions);
  const [studentInput, setStudentInput] = useState({
    TAeval: "",
    additionalFeedback: "",
  });

  useEffect(() => {
    console.log("ss updated");
  }, [TAquestions]);

  useEffect(() => {
    console.log("course updated");
    getCourseInformation();
  }, []);

  const getCourseInformation = () => {
    if (!ISSERVER) {
      var surveyToken = router.query.token;
      const courseJson = jwt.decode(surveyToken);
      console.log(courseJson.departmentName);
      if (
        courseJson == null ||
        courseJson.courseNumber == undefined ||
        courseJson.courseSemester == undefined ||
        courseJson.courseYear == undefined ||
        courseJson.displayName == undefined ||
        courseJson.departmentName == undefined
      ) {
        router.push({
          pathname: "/wrongSurvey",
        });
      } else {
        setCourseInformation({
          courseNumber: courseJson.courseNumber,
          courseSemester: courseJson.courseSemester,
          courseYear: courseJson.courseYear,
          courseDisplayName: courseJson.displayName,
          courseDepartment: courseJson.departmentName,
        });
        console.log(courseJson.courseNumber);
        console.log(courseJson.departmentName);
      }
    }
  };

  const testFunction = () => {
    console.log(studentInformation, outcomeSurvey, TAquestions, studentInput);
    if (
      studentInformation.major === "" ||
      studentInformation.classification == "" ||
      studentInformation.grade === ""
    ) {
      alert(" Please complete the student information");
    }
    let i;
    let counter = 0;
    for (i = 0; i < outcomeSurvey.length; i++) {
      if (outcomeSurvey[i].rating === 0) {
        alert("Please answer all course outcomes");
        break;
      }
    }
    let j;
    let taCounter = 0;
    for (j = 0; j < TAquestions.length; j++) {
      if (TAquestions[i].rating === 0) {
        alert("Please answer the Ta questions");
        break;
      }
    }
  };

  const submitSurvey = () => {};

  const handleChange = (rating, idx, type) => {
    if (type == "TA") {
      var temp = TAquestions;
      temp[idx].rating = parseInt(rating);
      setTAquestions([...temp]);
      console.log(TAquestions[idx]);
    } else if (type == "Outcomes") {
      var temp = outcomeSurvey;
      outcomeSurvey[idx].rating = parseInt(rating);
      setOutcomeSurvey([...temp]);
      console.log(outcomeSurvey[idx]);
    } else {
      console.log("incorrect type");
    }
  };

  return (
    <PageContext.Provider value={pageData}>
      <Head>
        <title>UNT Course Feedback Survey</title>
      </Head>
      <Navigation />
      {isLoggedIn ? (
        <VStack mt="2em">
          <Box w="80%">
            <Text fontSize="2xl" fontWeight="bold">
              {courseInformation.courseDepartment +
                " " +
                courseInformation.courseNumber +
                " " +
                courseInformation.courseDisplayName}
            </Text>
            <Text fontSize="2xl" fontWeight="bold">
              {courseInformation.courseSemester +
                " " +
                courseInformation.courseYear}
            </Text>
            <Text fontSize="xl" fontWeight="bold" color="green">
              Student Feedback Survey
            </Text>
          </Box>
          <StudentInfoForm
            studentInformation={studentInformation}
            setStudentInformation={setStudentInformation}
          />
          <CourseOutcomesSurvey
            outcomeSurvey={outcomeSurvey}
            handleChange={handleChange}
          />
          <TAsurvey TAquestions={TAquestions} handleChange={handleChange} />
          <StudentFeedback
            studentInput={studentInput}
            setStudentInput={setStudentInput}
          />

          <Button onClick={testFunction} mb="1em" colorScheme="green">
            Submit Survey
          </Button>
        </VStack>
      ) : (
        <StudentLoginBox toggleLoggin={toggleLogin} />
      )}
    </PageContext.Provider>
  );
};
export default studentSurvey;