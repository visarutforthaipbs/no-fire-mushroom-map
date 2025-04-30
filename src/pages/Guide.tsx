import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Container,
  VStack,
  Button,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  useBreakpointValue,
  HStack,
  Link,
  Divider,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

// Icons for the tips
const Icons = {
  Rain: () => (
    <Box fontSize="2xl" mb={2}>
      🌧️
    </Box>
  ),
  Soil: () => (
    <Box fontSize="2xl" mb={2}>
      🌱
    </Box>
  ),
  Stream: () => (
    <Box fontSize="2xl" mb={2}>
      💧
    </Box>
  ),
  Stick: () => (
    <Box fontSize="2xl" mb={2}>
      🥢
    </Box>
  ),
  Path: () => (
    <Box fontSize="2xl" mb={2}>
      👣
    </Box>
  ),
  Forest: () => (
    <Box fontSize="2xl" mb={2}>
      🌳
    </Box>
  ),
  Soil2: () => (
    <Box fontSize="2xl" mb={2}>
      🪨
    </Box>
  ),
  Mountain: () => (
    <Box fontSize="2xl" mb={2}>
      ⛰️
    </Box>
  ),
  Slope: () => (
    <Box fontSize="2xl" mb={2}>
      📐
    </Box>
  ),
  Mushroom: () => (
    <Box fontSize="2xl" mb={2}>
      🍄
    </Box>
  ),
  Map: () => (
    <Box fontSize="2xl" mb={2}>
      🗺️
    </Box>
  ),
  Camera: () => (
    <Box fontSize="2xl" mb={2}>
      📸
    </Box>
  ),
  Clock: () => (
    <Box fontSize="2xl" mb={2}>
      ⏱️
    </Box>
  ),
  Compass: () => (
    <Box fontSize="2xl" mb={2}>
      🧭
    </Box>
  ),
  Warning: () => (
    <Box fontSize="2xl" mb={2}>
      ❌
    </Box>
  ),
};

// Mushroom finding tips
const tips = [
  {
    id: 1,
    title: "สังเกตฝนแรก",
    description:
      "หลังจากฝนตกหนักครั้งแรกของฤดู ให้รอประมาณ 3-5 วัน เห็ดถอบจะเริ่มโผล่ขึ้นมาจากดิน",
    icon: Icons.Rain,
  },
  {
    id: 2,
    title: "ดูดินแตกระแหงใต้ต้นไม้",
    description:
      "สังเกตพื้นที่ใต้ต้นไม้ที่มีดินแตกระแหง โดยเฉพาะบริเวณป่าเต็งรัง ป่าเบญจพรรณ",
    icon: Icons.Soil,
  },
  {
    id: 3,
    title: "เดินตามร่องน้ำธรรมชาติ",
    description:
      "ร่องน้ำธรรมชาติมักมีความชื้นที่เหมาะสม และเป็นทางผ่านของสปอร์เห็ด",
    icon: Icons.Stream,
  },
  {
    id: 4,
    title: "ใช้ไม้เขี่ยเบาๆ ไม่ขุดแรง",
    description:
      "หากพบเห็ดถอบ ให้ใช้ไม้เขี่ยดินเบาๆ ไม่ทำลายเส้นใยใต้ดิน เพื่อให้เห็ดสามารถเกิดใหม่ได้",
    icon: Icons.Stick,
  },
  {
    id: 5,
    title: "อย่าเดินซ้ำ - เห็ดจะกลับมา",
    description:
      "หลังเก็บเห็ดแล้ว ให้หลีกเลี่ยงการเดินย่ำบริเวณเดิม เพื่อไม่ให้เส้นใยเห็ดถูกทำลาย",
    icon: Icons.Path,
  },
];

// What mushrooms like
const mushroomPreferences = [
  {
    id: 1,
    title: "ป่า",
    description: "ป่าเต็งรังและป่าเบญจพรรณ ที่มีพืชตระกูลยาง",
    icon: Icons.Forest,
  },
  {
    id: 2,
    title: "ดิน",
    description: "ดินร่วนปนทราย ระบายน้ำได้ดี",
    icon: Icons.Soil2,
  },
  {
    id: 3,
    title: "ความสูง",
    description: "ระดับความสูง 400-800 เมตรจากระดับน้ำทะเล",
    icon: Icons.Mountain,
  },
  {
    id: 4,
    title: "ความลาดชัน",
    description: "พื้นที่ลาดเอียง 0-20% ช่วยในการระบายน้ำ",
    icon: Icons.Slope,
  },
  {
    id: 5,
    title: "ช่วงเวลา",
    description: "ช่วงต้นฤดูฝน (พฤษภาคม-กรกฎาคม) หลังฝนตกใหม่ๆ",
    icon: Icons.Mushroom,
  },
];

// Detailed steps
const findingSteps = [
  {
    id: 1,
    title: "ตรวจพยากรณ์ฝน",
    description:
      "ดูพยากรณ์อากาศและคาดการณ์ช่วงที่ฝนตกหนักแล้วหยุด 3-5 วัน นั่นคือช่วงที่เห็ดถอบมักจะเริ่มโผล่",
  },
  {
    id: 2,
    title: "ดูแผนที่โซนศักยภาพ",
    description:
      "ศึกษาแผนที่ศักยภาพเห็ดถอบในพื้นที่ของคุณ ช่วยเพิ่มโอกาสการพบเห็ดได้มาก",
  },
  {
    id: 3,
    title: "สังเกตดินแตกระแหง",
    description:
      "สังเกตพื้นดินที่มีรอยแตกเล็กๆ มักเป็นสัญญาณของเห็ดถอบกำลังจะโผล่",
  },
  {
    id: 4,
    title: "ใช้ไม้เขี่ยเบาๆ",
    description:
      "เมื่อพบจุดที่สงสัย ให้ใช้ไม้หรือกิ่งไม้เขี่ยดินเบาๆ อย่าขุดลึกเพราะจะทำลายเส้นใย",
    icon: Icons.Stick,
  },
  {
    id: 5,
    title: "หลีกเลี่ยงการเดินซ้ำ",
    description:
      "หลังเก็บเห็ดแล้ว พยายามจำตำแหน่งและเส้นทางเพื่อไม่เดินย่ำในจุดเดิมซ้ำอีก",
    icon: Icons.Path,
  },
];

// Support features
const supportFeatures = [
  {
    id: 1,
    title: "ระบุตำแหน่งของคุณ",
    description:
      "ใช้ GPS ในโทรศัพท์เพื่อบันทึกจุดที่พบเห็ด และช่วยในการกลับมาหาในฤดูกาลถัดไป",
    icon: Icons.Map,
  },
  {
    id: 2,
    title: "เปรียบเทียบรูปภาพ",
    description:
      "ถ่ายรูปเห็ดเพื่อเปรียบเทียบกับตัวอย่าง และยืนยันว่าเป็นเห็ดถอบจริง ไม่ใช่เห็ดพิษ",
    icon: Icons.Camera,
  },
  {
    id: 3,
    title: "ช่วงเวลาที่เหมาะสม",
    description:
      "ควรออกเก็บเห็ดในช่วงเช้า 6-10 น. เมื่ออากาศยังเย็น และเห็ดเพิ่งโผล่",
    icon: Icons.Clock,
  },
  {
    id: 4,
    title: "เทคนิคการเดินป่า",
    description:
      "เดินแบบซิกแซกขึ้นลงตามเนินเขา จะช่วยให้พบเห็ดถอบได้ง่ายกว่าเดินตรง",
    icon: Icons.Compass,
  },
  {
    id: 5,
    title: "ข้อควรระวัง",
    description:
      "ระวังสัตว์มีพิษ ไม่เก็บเห็ดที่ไม่รู้จัก และแจ้งคนอื่นเสมอเมื่อเข้าป่า",
    icon: Icons.Warning,
  },
];

const Guide: React.FC = () => {
  const cardBg = "white";
  const borderColor = "brand.100";
  const columns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 5 });

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "คู่มือหาเห็ดถอบแบบไม่ต้องเผาป่า",
          text: "เรียนรู้วิธีหาเห็ดถอบแบบไม่ต้องเผาป่า รักษาระบบนิเวศและได้เห็ดที่อร่อย!",
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      alert("ระบบของคุณไม่รองรับการแชร์ โปรดคัดลอก URL และแชร์ด้วยตนเอง");
    }
  };

  return (
    <Box>
      <VStack spacing={10} align="stretch">
        {/* Intro Section */}
        <Box>
          <Heading
            as="h1"
            size="xl"
            mb={6}
            fontFamily="heading"
            color="brand.700"
          >
            วิธีหาเห็ดถอบแบบไม่ต้องเผาป่า
          </Heading>

          <Box p={6} bg="brand.50" borderRadius="xl" mb={8}>
            <Heading
              as="h2"
              size="md"
              mb={4}
              fontFamily="heading"
              color="brand.600"
            >
              รู้จักกับ "เห็ดถอบ" หรือ "เห็ดเผาะ"
            </Heading>
            <Text mb={4}>
              เห็ดถอบหรือเห็ดเผาะ เป็นเห็ดพื้นบ้านที่มีชื่อวิทยาศาสตร์ว่า{" "}
              <i>Astraeus hygrometricus</i>{" "}
              เป็นที่นิยมในภาคเหนือและภาคอีสานของไทย เนื่องจากรสชาติที่อร่อย
              เนื้อแน่น และกลิ่นหอมเฉพาะตัว นิยมนำมาประกอบอาหารเช่น แกงเห็ดถอบ
              หรือลาบเห็ดถอบ
            </Text>
            <Text mb={4}>
              <b>ความเชื่อผิดๆ:</b> หลายคนเชื่อว่า{" "}
              <b>"ต้องเผาป่าก่อน เห็ดถอบถึงจะขึ้น"</b> ❌ แต่ความจริงแล้ว
              เห็ดถอบจะขึ้นเองตามธรรมชาติ เมื่อสภาพแวดล้อมเหมาะสม
              โดยไม่จำเป็นต้องเผาป่าแต่อย่างใด
            </Text>
            <Text>
              <b>ความจริง:</b> ปัจจัยสำคัญที่ทำให้เห็ดถอบเจริญเติบโต คือ สภาพดิน
              ชนิดป่า ปริมาณฝน และความลาดชันที่เหมาะสม
              การเผาป่ากลับทำลายหน้าดินและเส้นใยเห็ด ทำให้ระยะยาวจะมีเห็ดน้อยลง
            </Text>
          </Box>

          <Text mb={8} fontSize="lg">
            เห็ดถอบสามารถหาได้โดยไม่ต้องเผาป่า
            เพียงอาศัยความเข้าใจในธรรมชาติและสังเกตสภาพแวดล้อมให้ดี
            ต่อไปนี้เป็นเคล็ดลับที่ช่วยให้คุณหาเห็ดถอบได้อย่างยั่งยืน
          </Text>
        </Box>

        {/* What mushrooms like section */}
        <Box>
          <Heading
            as="h2"
            size="lg"
            mb={6}
            fontFamily="heading"
            color="brand.700"
          >
            🌱 สภาพแวดล้อมที่เห็ดถอบชอบ
          </Heading>

          <SimpleGrid columns={columns} gap={4} mb={10}>
            {mushroomPreferences.map((item) => (
              <Flex
                key={item.id}
                direction="column"
                align="center"
                p={4}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="xl"
                boxShadow="md"
                textAlign="center"
                height="100%"
                transition="transform 0.2s"
                _hover={{ transform: "translateY(-5px)" }}
              >
                <item.icon />

                <Heading
                  as="h3"
                  size="sm"
                  mb={2}
                  fontFamily="heading"
                  color="brand.600"
                >
                  {item.title}
                </Heading>

                <Text fontSize="sm">{item.description}</Text>
              </Flex>
            ))}
          </SimpleGrid>
        </Box>

        {/* Original tips section */}
        <Box>
          <Heading
            as="h2"
            size="lg"
            mb={6}
            fontFamily="heading"
            color="brand.700"
          >
            💡 เคล็ดลับการหาเห็ดถอบ
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} mb={10}>
            {tips.map((tip) => (
              <Flex
                key={tip.id}
                direction="column"
                align="center"
                p={6}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="xl"
                boxShadow="md"
                textAlign="center"
                height="100%"
              >
                <tip.icon />

                <Heading
                  as="h3"
                  size="md"
                  mb={2}
                  fontFamily="heading"
                  color="brand.600"
                >
                  {tip.title}
                </Heading>

                <Text>{tip.description}</Text>
              </Flex>
            ))}
          </SimpleGrid>
        </Box>

        {/* Steps to Find Mushrooms */}
        <Box>
          <Heading
            as="h2"
            size="lg"
            mb={6}
            fontFamily="heading"
            color="brand.700"
          >
            👣 ขั้นตอนการค้นหาเห็ดถอบสำหรับมือใหม่
          </Heading>

          <VStack spacing={4} align="stretch" mb={10}>
            {findingSteps.map((step) => (
              <Box
                key={step.id}
                p={5}
                bg="white"
                borderRadius="lg"
                boxShadow="sm"
                borderLeft="4px solid"
                borderColor="brand.500"
              >
                <Flex align="center" mb={2}>
                  <Box
                    bg="brand.500"
                    color="white"
                    borderRadius="full"
                    w="32px"
                    h="32px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mr={3}
                  >
                    {step.id}
                  </Box>
                  <Heading
                    as="h3"
                    size="md"
                    fontFamily="heading"
                    color="brand.600"
                  >
                    {step.title}
                  </Heading>
                </Flex>
                <Text pl="45px">{step.description}</Text>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Support Features */}
        <Box>
          <Heading
            as="h2"
            size="lg"
            mb={6}
            fontFamily="heading"
            color="brand.700"
          >
            🧩 เครื่องมือช่วยสำหรับมือใหม่
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} mb={10}>
            {supportFeatures.map((feature) => (
              <Flex
                key={feature.id}
                direction="column"
                align="center"
                p={6}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="xl"
                boxShadow="md"
                textAlign="center"
                height="100%"
              >
                <feature.icon />

                <Heading
                  as="h3"
                  size="md"
                  mb={2}
                  fontFamily="heading"
                  color="brand.600"
                >
                  {feature.title}
                </Heading>

                <Text>{feature.description}</Text>
              </Flex>
            ))}
          </SimpleGrid>
        </Box>

        {/* Warning section from original code */}
        <Box
          p={6}
          bg={useBreakpointValue({ base: "orange.50", md: "warning.500" })}
          borderRadius="xl"
          opacity={0.9}
          mb={6}
        >
          <Heading
            as="h3"
            size="md"
            mb={4}
            fontFamily="heading"
            color="brand.700"
          >
            ⚠️ ทำไมการเผาป่าเพื่อหาเห็ดถอบจึงเป็นอันตราย?
          </Heading>

          <Text mb={3}>1. ทำลายระบบนิเวศและความหลากหลายทางชีวภาพ</Text>
          <Text mb={3}>2. ทำให้เกิดมลพิษทางอากาศ ส่งผลกระทบต่อสุขภาพ</Text>
          <Text mb={3}>
            3. ทำลายหน้าดินและเส้นใยเห็ด ทำให้ในระยะยาวจะมีเห็ดน้อยลง
          </Text>
          <Text mb={3}>4. เพิ่มความเสี่ยงในการเกิดไฟป่าที่ควบคุมไม่ได้</Text>
        </Box>

        {/* Quote from original code but enhanced */}
        <Box
          p={6}
          bg="brand.50"
          borderRadius="xl"
          borderLeftWidth="8px"
          borderColor="brand.500"
          mb={8}
        >
          <Text fontSize="xl" fontStyle="italic" textAlign="center">
            "ไม่ต้องเป็นชาวป่า ก็หาเห็ดถอบได้ — แค่รู้จักป่า เข้าใจดิน
            แล้วไม่ใช้ไฟ 🔥"
          </Text>
        </Box>

        {/* CTA Buttons */}
        <HStack spacing={4} justify="center" mb={6} wrap="wrap">
          <Button
            as={RouterLink}
            to="/"
            colorScheme="brand"
            size="lg"
            leftIcon={<span>🗺️</span>}
          >
            เปิดแผนที่เห็ดถอบ
          </Button>
          <Button
            colorScheme="brand"
            variant="outline"
            size="lg"
            leftIcon={<span>🔗</span>}
            onClick={handleShare}
          >
            แชร์คู่มือให้เพื่อน
          </Button>
          <Button
            colorScheme="brand"
            variant="ghost"
            size="lg"
            leftIcon={<span>📍</span>}
            isDisabled
            title="คุณสมบัตินี้กำลังอยู่ระหว่างการพัฒนา"
          >
            แจ้งจุดที่เจอเห็ด
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Guide;
