import React from "react";
import { Box, Container, Flex, Heading, Image } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const bgColor = "white";

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Box minH="100vh" bg="background">
      <Box
        as="nav"
        py={3}
        boxShadow="sm"
        bg={bgColor}
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Container maxW="container.xl">
          <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
              <Image
                src="/logo-main.png"
                alt="เห็ดถอบไม่ต้องเผา"
                height="40px"
                mr={3}
              />
              <Heading size="md" fontFamily="heading" color="brand.700">
                <RouterLink to="/" style={{ textDecoration: "none" }}>
                  เห็ดถอบไม่ต้องเผา
                </RouterLink>
              </Heading>
            </Flex>
            <Flex gap={6}>
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
            </Flex>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        {children}
      </Container>

      <Box as="footer" py={8} bg={bgColor} mt="auto">
        <Container maxW="container.xl" textAlign="center">
          <Flex direction="column" alignItems="center">
            <Image
              src="/logo-main.png"
              alt="เห็ดถอบไม่ต้องเผา"
              height="60px"
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
