import { HStack, Text, View } from "@gluestack-ui/themed";
import { Link, Stack, useLocalSearchParams } from "expo-router";
export default () => {
  const url = useLocalSearchParams();
  const isMap = url.screen === "discoverMap";
  return (
    <View flex={1}>
      <View
        right="$4"
        bottom="$4"
        position="absolute"
        zIndex={99}
        justifyContent="center"
      >
        <HStack borderRadius="$full">
          <Link href={"/discoverMap"}>
            <View
              alignItems="center"
              borderTopLeftRadius="$full"
              borderBottomLeftRadius="$full"
              bg={isMap ? "$blue500" : "$backgroundLight400"}
              p="$2"
              pl="$4"
            >
              <Text color={isMap ? "white" : "$textLight100"} bold>
                Map
              </Text>
            </View>
          </Link>
          <Link href={"/discoverList"}>
            <View
              borderTopRightRadius="$full"
              borderBottomRightRadius="$full"
              bg={!isMap ? "$blue500" : "$backgroundLight400"}
              p="$2"
              pr="$4"
            >
              <Text color={!isMap ? "white" : "$textLight100"} bold>
                List
              </Text>
            </View>
          </Link>
        </HStack>
      </View>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="list"
      >
        <Stack.Screen name="discoverMap" />
        <Stack.Screen name="discoverList" />
      </Stack>
    </View>
  );
};
