import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  IconButton,
  Icon,
  SimpleGrid,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  useToast,
} from "@chakra-ui/react";
import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import hedTobZones, { processHedTobZones } from "../data/hed_tob_zones";
import doisaketDistrict, {
  processDoisaketDistrict,
} from "../data/doisaket-district";
import L from "leaflet";
import { LatLngTuple } from "leaflet";
import { FeatureCollection } from "geojson";

// Fix for Leaflet default icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Weather check component
const WeatherCheck: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isGoodTime, setIsGoodTime] = useState<boolean | null>(null);
  const [precipData, setPrecipData] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [useCustomLocation, setUseCustomLocation] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: 18.8, lng: 99.1 });
  const toast = useToast();

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lng}&daily=precipitation_sum&timezone=Asia/Bangkok&past_days=7`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
          throw new Error(
            data.reason || "เกิดข้อผิดพลาดในการดึงข้อมูลสภาพอากาศ"
          );
        }

        const precipitationValues = data.daily.precipitation_sum;
        setPrecipData(precipitationValues);

        // Check if there was rainfall ≥ 3mm on any day between 2 to 5 days ago
        const recentDays = precipitationValues.slice(-7, -1); // Get last 7 days excluding today
        const relevantDays = recentDays.slice(-5, -1); // Get days 2-5 ago

        const goodConditions = relevantDays.some((rain: number) => rain >= 3);
        setIsGoodTime(goodConditions);
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError(
          err instanceof Error ? err.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ"
        );
        setIsGoodTime(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [coordinates]);

  const getLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCoordinates(newCoords);
          setUseCustomLocation(true);
          toast({
            title: "อัพเดตตำแหน่ง",
            description: `ใช้พิกัดของคุณแล้ว: ${newCoords.lat.toFixed(
              2
            )}, ${newCoords.lng.toFixed(2)}`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        },
        (err) => {
          console.error("Error getting location:", err);
          toast({
            title: "ไม่สามารถระบุตำแหน่งได้",
            description: "กำลังใช้พิกัดดอยสะเก็ดเป็นค่าเริ่มต้น",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          setLoading(false);
        }
      );
    } else {
      toast({
        title: "ไม่รองรับการระบุตำแหน่ง",
        description: "เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง GPS",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      p={2}
      bg="white"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="brand.100"
      boxShadow="sm"
      h="auto"
    >
      <Heading
        as="h3"
        size="sm"
        mb={1}
        display="flex"
        alignItems="center"
        fontFamily="heading"
        color="brand.600"
      >
        <Box as="span" fontSize="md" mr={1}>
          ☔
        </Box>
        ตรวจสอบสภาพอากาศ
      </Heading>

      {loading ? (
        <Flex align="center" justify="center" py={2}>
          <Spinner
            thickness="3px"
            speed="0.65s"
            emptyColor="gray.200"
            color="brand.500"
            size="sm"
            mr={2}
          />
          <Text fontSize="xs">กำลังตรวจสอบปริมาณฝน...</Text>
        </Flex>
      ) : error ? (
        <Alert status="error" borderRadius="md" size="sm" py={1}>
          <AlertIcon />
          <Text fontSize="xs">{error}</Text>
        </Alert>
      ) : (
        <Flex direction="column">
          <Alert
            status={isGoodTime ? "success" : "warning"}
            variant="solid"
            borderRadius="md"
            mb={2}
            py={isGoodTime ? 2 : 1}
            fontSize="xs"
          >
            <AlertIcon boxSize={isGoodTime ? "18px" : "14px"} />
            <Flex align="center">
              <Text
                fontWeight="bold"
                fontSize={isGoodTime ? "md" : "xs"}
                letterSpacing={isGoodTime ? "wide" : "normal"}
              >
                {isGoodTime
                  ? "มีฝนตก เหมาะกับการหาเห็ดถอบ!"
                  : "ยังไม่มีฝนตกเพียงพอ อาจยังไม่เหมาะ"}
              </Text>
              {isGoodTime && (
                <Box as="span" ml={1} fontSize="md">
                  🍄
                </Box>
              )}
            </Flex>
          </Alert>

          <Flex direction="column" gap={1}>
            <Text fontSize="xs" mb={1}>
              ปริมาณฝนย้อนหลัง 7 วัน (
              {useCustomLocation ? "พิกัดของคุณ" : "ดอยสะเก็ด"}):
            </Text>

            <SimpleGrid columns={{ base: 7 }} spacing={1} mb={2}>
              {precipData.slice(-7).map((rain, index) => (
                <Box
                  key={index}
                  p={1}
                  bg={rain >= 3 ? "mushroom.100" : "gray.50"}
                  borderRadius="sm"
                  textAlign="center"
                  borderWidth={1}
                  borderColor={rain >= 3 ? "mushroom.300" : "gray.200"}
                >
                  <Text fontSize="2xs" color="gray.500">
                    {index === 6 ? "วันนี้" : `${6 - index}d`}
                  </Text>
                  <Text
                    fontWeight="bold"
                    fontSize="2xs"
                    color={rain >= 3 ? "mushroom.700" : "gray.600"}
                  >
                    {rain.toFixed(1)}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>

            <Button
              onClick={getLocation}
              colorScheme="brand"
              variant="outline"
              size="xs"
              leftIcon={<Box as="span">📍</Box>}
              isLoading={loading}
            >
              ใช้ตำแหน่งของฉัน
            </Button>
          </Flex>
        </Flex>
      )}
    </Box>
  );
};

// Fix for Leaflet default icon issue
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Style functions for the GeoJSON
const getFeatureStyle = (feature: any) => {
  const { potential } = feature.properties || {};

  switch (potential) {
    case "high":
      return {
        fillColor: "#8D6E63", // soil.500
        weight: 1,
        opacity: 1,
        color: "#6D4C41", // darker brown
        fillOpacity: 0.7,
      };
    case "medium":
      return {
        fillColor: "#A1887F", // medium brown
        weight: 1,
        opacity: 1,
        color: "#8D6E63", // soil.500
        fillOpacity: 0.6,
      };
    case "low":
      return {
        fillColor: "#BCAAA4", // lighter brown
        weight: 1,
        opacity: 1,
        color: "#A1887F",
        fillOpacity: 0.5,
      };
    default:
      return {
        fillColor: "#D7CCC8", // soil.100
        weight: 1,
        opacity: 1,
        color: "#BCAAA4",
        fillOpacity: 0.4,
      };
  }
};

// Style for district boundaries
const districtStyle = {
  color: "#4CAF50", // brand.500
  weight: 2,
  opacity: 1,
  fillColor: "transparent",
};

// Fixed coordinates for Doi Saket, Thailand
const DOI_SAKET_CENTER: LatLngTuple = [18.8822, 99.22]; // Approximate center of Doi Saket in WGS84

const Map: React.FC = () => {
  const [mushroomZones, setMushroomZones] =
    useState<FeatureCollection>(hedTobZones);
  const [districtData, setDistrictData] =
    useState<FeatureCollection>(doisaketDistrict);
  const [dataLoading, setDataLoading] = useState(true);

  // Create a ref to track loading state for timeout
  const dataLoadingRef = React.useRef(true);

  // Add debugging state
  const [debugInfo, setDebugInfo] = useState({
    hedTobZonesLength: hedTobZones.features.length,
    doisaketDistrictLength: doisaketDistrict.features.length,
  });

  // Update ref when state changes
  useEffect(() => {
    dataLoadingRef.current = dataLoading;
  }, [dataLoading]);

  useEffect(() => {
    console.log("Map component mounted, checking data loading status");

    // Add a fallback timeout to ensure loading message disappears
    const loadingTimeout = setTimeout(() => {
      if (dataLoadingRef.current) {
        console.log("Loading timeout reached, forcing dataLoading to false");
        setDataLoading(false);
      }
    }, 10000); // 10 seconds timeout

    // Function to handle mushroom zone data loading
    const handleMushroomZonesLoaded = () => {
      console.log("Mushroom zones data loaded event received");
      setMushroomZones(hedTobZones);
      console.log(
        "Updated mushroom zones, length:",
        hedTobZones.features.length
      );

      // Update debug info
      setDebugInfo((prev) => ({
        ...prev,
        hedTobZonesLength: hedTobZones.features.length,
      }));

      checkAllDataLoaded();
    };

    // Function to handle district data loading
    const handleDistrictLoaded = () => {
      console.log("District data loaded event received");
      setDistrictData(doisaketDistrict);
      console.log(
        "Updated district data, length:",
        doisaketDistrict.features.length
      );

      // Update debug info
      setDebugInfo((prev) => ({
        ...prev,
        doisaketDistrictLength: doisaketDistrict.features.length,
      }));

      checkAllDataLoaded();
    };

    // Function to check if all data is loaded
    const checkAllDataLoaded = () => {
      console.log(
        "Checking data loaded status:",
        "hedTobZones =",
        hedTobZones.features.length,
        "doisaketDistrict =",
        doisaketDistrict.features.length
      );

      if (
        hedTobZones.features.length > 0 &&
        doisaketDistrict.features.length > 0
      ) {
        console.log("All data loaded, setting dataLoading to false");
        setDataLoading(false);
      } else {
        console.log("Not all data loaded yet, dataLoading remains true");
      }
    };

    // Add event listeners
    window.addEventListener("hedTobZonesLoaded", handleMushroomZonesLoaded);
    window.addEventListener("doisaketDistrictLoaded", handleDistrictLoaded);

    // Initial load check - in case the data is already loaded
    if (
      hedTobZones.features.length > 0 &&
      doisaketDistrict.features.length > 0
    ) {
      console.log("Data already loaded on mount, setting dataLoading to false");
      setDataLoading(false);
    } else {
      console.log("Data not already loaded, will manually load data");
      // If data isn't loaded, we could manually trigger a reload
      if (hedTobZones.features.length === 0) {
        console.log("Loading mushroom zones data manually");
        processHedTobZones().then((data) => {
          console.log(
            "Manual mushroom zones data loaded, length:",
            data.features.length
          );
          setMushroomZones(data);

          // Update debug info
          setDebugInfo((prev) => ({
            ...prev,
            hedTobZonesLength: data.features.length,
          }));

          if (doisaketDistrict.features.length > 0) {
            console.log(
              "Both datasets loaded after mushroom zone load, setting dataLoading to false"
            );
            setDataLoading(false);
          }
        });
      }

      if (doisaketDistrict.features.length === 0) {
        console.log("Loading district data manually");
        processDoisaketDistrict().then((data) => {
          console.log(
            "Manual district data loaded, length:",
            data.features.length
          );
          setDistrictData(data);

          // Update debug info
          setDebugInfo((prev) => ({
            ...prev,
            doisaketDistrictLength: data.features.length,
          }));

          if (hedTobZones.features.length > 0) {
            console.log(
              "Both datasets loaded after district load, setting dataLoading to false"
            );
            setDataLoading(false);
          }
        });
      }
    }

    // Log current data state
    console.log("Initial district data:", doisaketDistrict);
    console.log("Initial mushroom zone data:", hedTobZones);

    // Clean up event listeners and timeout
    return () => {
      window.removeEventListener(
        "hedTobZonesLoaded",
        handleMushroomZonesLoaded
      );
      window.removeEventListener(
        "doisaketDistrictLoaded",
        handleDistrictLoaded
      );
      clearTimeout(loadingTimeout);
    };
  }, []);

  // Effect to monitor dataLoading state changes
  useEffect(() => {
    console.log("dataLoading state changed to:", dataLoading);
  }, [dataLoading]);

  // Use fixed coordinates for the map center
  const center = DOI_SAKET_CENTER;

  return (
    <Box>
      <Heading as="h1" size="xl" mb={6} fontFamily="heading" color="brand.700">
        แผนที่ศักยภาพเห็ดถอบ
      </Heading>

      <Box
        position="relative"
        h={{ base: "calc(100vh - 200px)", md: "calc(100vh - 200px)" }}
      >
        {/* Weather Section & Map Info - 25% of the width */}
        <Box
          position="absolute"
          top={0}
          left={0}
          bottom={0}
          width="25%"
          zIndex={1}
          overflowY="auto"
        >
          {/* Weather Check Component */}
          <WeatherCheck />

          {/* Map Description - Static content that was previously in the sidebar */}
          <Box
            p={3}
            bg="white"
            borderRadius="xl"
            borderWidth="1px"
            borderColor="brand.100"
            boxShadow="md"
            mt={3}
          >
            <Heading
              as="h3"
              size="md"
              mb={3}
              fontFamily="heading"
              color="brand.700"
            >
              คำอธิบายแผนที่
            </Heading>

            <Box bg="brand.50" p={3} borderRadius="lg" boxShadow="sm" mb={3}>
              <Text mb={2} fontSize="sm">
                แผนที่นี้แสดงพื้นที่ที่มีศักยภาพในการเกิดเห็ดถอบ (เห็ดเผาะ)
                ในอำเภอดอยสะเก็ด จังหวัดเชียงใหม่
                โดยวิเคราะห์จากปัจจัยที่เหมาะสมต่อการเกิดเห็ด ได้แก่:
              </Text>
              <ul style={{ paddingLeft: "20px", marginBottom: "0" }}>
                <Text as="li" mb={1} fontSize="sm">
                  ชนิดป่าเต็งรังและป่าเบญจพรรณ
                </Text>
                <Text as="li" mb={1} fontSize="sm">
                  ความสูงจากระดับน้ำทะเล 400-800 เมตร
                </Text>
                <Text as="li" mb={1} fontSize="sm">
                  ความลาดชัน 0-20%
                </Text>
                <Text as="li" fontSize="sm">
                  ลักษณะดินที่ระบายน้ำได้ดี
                </Text>
              </ul>
            </Box>

            <Box bg="brand.50" p={3} borderRadius="lg" boxShadow="sm" mb={3}>
              <Text fontWeight="bold" mb={2} fontSize="sm">
                เหตุใดจึงไม่ควรเผาป่า?
              </Text>
              <Text fontSize="sm">
                แม้มีความเชื่อว่าการเผาป่าจะช่วยให้หาเห็ดถอบได้ง่ายขึ้น
                แต่จากการศึกษาพบว่า การเผาป่าทำลายเส้นใยเห็ดใต้ดิน
                และในระยะยาวจะทำให้ผลผลิตเห็ดลดลง
                นอกจากนี้ยังทำลายระบบนิเวศและก่อมลพิษทางอากาศ
              </Text>
            </Box>

            <Box bg="brand.50" p={3} borderRadius="lg" boxShadow="sm">
              <Text fontWeight="bold" mb={2} fontSize="sm">
                ความหมายของโซนสี
              </Text>

              <Stack align="stretch" gap={1} fontSize="sm">
                <Flex align="center">
                  <Box bg="#8D6E63" w="16px" h="16px" borderRadius="md" />
                  <Text ml={2} fontSize="xs">
                    โซนศักยภาพสูง - พื้นที่ที่มีความเหมาะสมมากที่สุด
                  </Text>
                </Flex>

                <Flex align="center">
                  <Box bg="#A1887F" w="16px" h="16px" borderRadius="md" />
                  <Text ml={2} fontSize="xs">
                    โซนศักยภาพปานกลาง - พื้นที่ที่มีความเหมาะสมปานกลาง
                  </Text>
                </Flex>

                <Flex align="center">
                  <Box bg="#BCAAA4" w="16px" h="16px" borderRadius="md" />
                  <Text ml={2} fontSize="xs">
                    โซนศักยภาพต่ำ - พื้นที่ที่มีความเหมาะสมน้อย
                  </Text>
                </Flex>

                <Flex align="center">
                  <Box
                    borderColor="brand.500"
                    borderWidth="2px"
                    w="16px"
                    h="16px"
                    borderRadius="md"
                  />
                  <Text ml={2} fontSize="xs">
                    ขอบเขตอำเภอดอยสะเก็ด
                  </Text>
                </Flex>
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Map Container - 75% of the width */}
        <Box
          position="absolute"
          top={0}
          right={0}
          left="25%"
          bottom={0}
          borderRadius="xl"
          overflow="hidden"
          borderWidth="1px"
          borderColor="gray.200"
        >
          {dataLoading && (
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              bg="white"
              p={3}
              borderRadius="md"
              zIndex={1000}
              boxShadow="md"
            >
              กำลังโหลดข้อมูล...
              <Text fontSize="xs" mt={1}>
                (hed_tob: {debugInfo.hedTobZonesLength}, district:{" "}
                {debugInfo.doisaketDistrictLength})
              </Text>
            </Box>
          )}
          <MapContainer
            center={center}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LayersControl position="topright">
              {districtData.features && districtData.features.length > 0 && (
                <LayersControl.Overlay checked name="ขอบเขตอำเภอดอยสะเก็ด">
                  <GeoJSON
                    key={`district-layer-${districtData.features.length}`}
                    data={districtData}
                    style={districtStyle}
                    onEachFeature={(feature, layer) => {
                      const name =
                        feature.properties?.NAME2 || "อำเภอดอยสะเก็ด";
                      layer.bindPopup(`<b>${name}</b>`);
                    }}
                  />
                </LayersControl.Overlay>
              )}
              {mushroomZones.features && mushroomZones.features.length > 0 && (
                <LayersControl.Overlay checked name="โซนศักยภาพเห็ดถอบ">
                  <GeoJSON
                    key={`mushroom-zone-layer-${mushroomZones.features.length}`}
                    data={mushroomZones}
                    style={getFeatureStyle}
                    onEachFeature={(feature, layer) => {
                      const potential =
                        feature.properties?.potential || "ไม่ระบุ";
                      const dn =
                        feature.properties?.DN !== undefined
                          ? `DN: ${feature.properties.DN}`
                          : "";
                      const area = feature.properties?.area_rai
                        ? `พื้นที่: ${feature.properties.area_rai} ไร่`
                        : "";

                      layer.bindPopup(
                        `<b>โซนศักยภาพเห็ดถอบ</b><br/>
                        ศักยภาพ: ${potential}<br/>
                        ${dn}<br/>
                        ${area}`
                      );
                    }}
                  />
                </LayersControl.Overlay>
              )}
            </LayersControl>
          </MapContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Map;
