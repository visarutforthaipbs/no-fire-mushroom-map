import React from "react";
import { Box, Button, Flex, Heading, Text, Stack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="70vh"
      textAlign="center"
      px={4}
    >
      <Stack gap={6} maxW="container.md">
        <Heading as="h1" size="2xl" color="primary.500" fontFamily="heading">
          เห็ดถอบไม่ต้องเผา
        </Heading>

        <Text fontSize="xl" fontFamily="body" color="accent.brown">
          รู้ป่า เข้าใจดิน เห็ดถอบจะมาเอง
        </Text>

        <Box h={8} />

        <Flex direction={{ base: "column", md: "row" }} gap={4}>
          <RouterLink to="/map">
            <Button size="lg" colorScheme="green" px={8} width="100%">
              ดูแผนที่เห็ดถอบ
            </Button>
          </RouterLink>

          <RouterLink to="/guide">
            <Button
              size="lg"
              colorScheme="gray"
              variant="outline"
              px={8}
              width="100%"
            >
              อ่านวิธีหาเห็ดถอบแบบไม่ต้องเผา
            </Button>
          </RouterLink>
        </Flex>

        <Box
          mt={16}
          p={6}
          bg="green.50"
          rounded="2xl"
          borderWidth="1px"
          borderColor="green.100"
        >
          <Text fontSize="md" fontStyle="italic">
            เห็ดถอบ หรือที่รู้จักในชื่อ "เห็ดเผาะ"
            เป็นเห็ดที่มีความสำคัญทางเศรษฐกิจและวัฒนธรรมของชุมชนในภาคเหนือและอีสาน
            แต่การหาเห็ดด้วยการเผาป่าสร้างปัญหาด้านสิ่งแวดล้อมมากมาย
            เราจึงรวบรวมภูมิปัญญาการหาเห็ดถอบโดยไม่ต้องเผาป่า
          </Text>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Home;
