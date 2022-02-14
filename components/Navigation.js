import {
  Link,
  Flex,
  Box,
  Button,
  MenuButton,
  VStack,
  HStack,
} from "@chakra-ui/react";
import API from "../api/api";
import React, { useEffect, useState } from "react";
import cookieCutter from "cookie-cutter";
import jwt from "jsonwebtoken";
import { Custom } from "../api/APIHelper";
const Navigation = ({ link, user }) => {
  const logout = () => {
    new API().logout();
  };
  const [userID, setUser] = useState("");

  const getUser = async () => {
    const ISSERVER = typeof window === "undefined";
    let isLoading = true;
    if (!ISSERVER) {
      const token = cookieCutter.get("token");
      const json = jwt.decode(token);
      if (json == null) {
        setUser("");
      } else {
        setUser(json.unique_name);
      }
      isLoading = false;
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Flex justifyContent="flex-end" mt="1em" mr="1em" dir="row">
      <HStack spacing="10px" >
        <Box
          as="button"
          borderRadius="md"
          color="black"
          fontSize="1.5em"
          px={1}
          h={8}
        >
          {userID}
        </Box>
        <Button
          bg="#016a31"
          color="white"
          ml="1em"
          _hover={{
            background: "teal",
            color: "white",
          }}
        >
          Home
        </Button>

        <Button
          bg="#016a31"
          color="white"
          ml="1em"
          _hover={{
            background: "teal",
            color: "white",
          }}
        >
          <Link href="/" onClick={logout}>
            Sign Out
          </Link>
        </Button>
        <Button
          bg="#016a31"
          color="white"
          ml="1em"
          _hover={{
            background: "teal",
            color: "white",
          }}
        >
          <Link href="/" onClick={Custom}>
            [Debug] Reload Database
          </Link>
        </Button>
      </HStack>
    </Flex>
  );

  // switch (link) {
  //     case '/formCompletion':
  //         return(
  //             <Box className="nav-container">
  //                 <Link href="/instructorHome">Home</Link>
  //                 <p><i className = "arrow right"></i></p>
  //                 <Link href="/formCompletion">Instructor ABET Form</Link>
  //                 <div className="alignright">
  //                     <Text className="user-name">bbb4200</Text>
  //                     <Link href="/" onClick={logout}>Sign Out</Link>
  //                 </div>
  //             </Box>
  //         )
  //         break;
  //     case '/coordinatorCommentInput':
  //         return(
  //             <Box className="nav-container">
  //                 <Link href="/instructorHome">Home</Link>
  //                 <p><i className = "arrow right"></i></p>
  //                 <Link href="/coordinatorCommentInput">Coordinator ABET Form</Link>
  //                 <div className="alignright">
  //                     <Text className="user-name">bbb4200</Text>
  //                     <Link href="/" onClick={logout}>Sign Out</Link>
  //                 </div>
  //             </Box>
  //         )
  //         break;
  //     default:
  //         return(
  //             <Box className="nav-container">
  //                 <Link href="/instructorHome">Home</Link>
  //                 {/* <Text className="user-name">bbb4200</Text> */}
  //                 <div className="alignright">
  //                     <Text className="user-name">MT2020</Text>
  //                     <Link href="/" onClick={logout}>Sign Out</Link>
  //                 </div>
  //             </Box>

  //         )
  //         break;
  // }
};

export default Navigation;
