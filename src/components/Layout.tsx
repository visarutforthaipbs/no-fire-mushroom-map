import React, { useState } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Image,
  IconButton,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const bgColor = "white";
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Responsive values
  const logoSize = useBreakpointValue({ base: "30px", md: "40px" });
  const headingSize = useBreakpointValue({ base: "sm", md: "md" });
  const navPadding = useBreakpointValue({ base: 2, md: 3 });
  const isMobile = useBreakpointValue({ base: true, md: false });
  const containerPadding = useBreakpointValue({ base: 3, md: 8 });

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Box minH="100vh" bg="background">
      <Box
        as="nav"
        py={navPadding}
        boxShadow="sm"
        bg={bgColor}
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Container maxW="container.xl" px={containerPadding}>
          <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
              <Image
                src="/logo-main.png"
                alt="เห็ดถอบไม่ต้องเผา"
                height={logoSize}
                mr={2}
              />
              <Heading
                size={headingSize}
                fontFamily="heading"
                color="brand.700"
              >
                <RouterLink to="/" style={{ textDecoration: "none" }}>
                  <Text noOfLines={1}>เห็ดถอบไม่ต้องเผา</Text>
                </RouterLink>
              </Heading>
            </Flex>

            {isMobile ? (
              <IconButton
                aria-label="Menu"
                icon={
                  <Box as="span" fontSize="xl">
                    ☰
                  </Box>
                }
                onClick={onOpen}
                variant="ghost"
                colorScheme="brand"
              />
            ) : (
              <HStack spacing={6}>
                <RouterLink
                  to="/"
                  style={{
                    fontWeight: isActive("/") ? "bold" : "normal",
                    color: isActive("/") ? "#4CAF50" : "#4A5568",
                  }}
                >
                  แผนที่ศักยภาพเห็ดถอบ
                </RouterLink>
                <RouterLink
                  to="/guide"
                  style={{
                    fontWeight: isActive("/guide") ? "bold" : "normal",
                    color: isActive("/guide") ? "#4CAF50" : "#4A5568",
                  }}
                >
                  How to หาเห็ดถอบแบบไม่เผา
                </RouterLink>
              </HStack>
            )}
          </Flex>
        </Container>
      </Box>

      {/* Mobile navigation drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">เมนูหลัก</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" pt={4}>
              <RouterLink
                to="/"
                style={{
                  fontWeight: isActive("/") ? "bold" : "normal",
                  color: isActive("/") ? "#4CAF50" : "#4A5568",
                }}
                onClick={onClose}
              >
                แผนที่ศักยภาพเห็ดถอบ
              </RouterLink>
              <RouterLink
                to="/guide"
                style={{
                  fontWeight: isActive("/guide") ? "bold" : "normal",
                  color: isActive("/guide") ? "#4CAF50" : "#4A5568",
                }}
                onClick={onClose}
              >
                How to หาเห็ดถอบแบบไม่เผา
              </RouterLink>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Container
        maxW="container.xl"
        py={containerPadding}
        px={containerPadding}
      >
        {children}
      </Container>

      <Box as="footer" py={containerPadding} bg={bgColor} mt="auto">
        <Container maxW="container.xl" textAlign="center" px={containerPadding}>
          <Flex direction="column" alignItems="center">
            <Image
              src="/logo-main.png"
              alt="เห็ดถอบไม่ต้องเผา"
              height={logoSize}
              mb={3}
            />
            <Heading size="xs" color="brand.600">
              เห็ดถอบไม่ต้องเผา &copy; {new Date().getFullYear()}
            </Heading>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
