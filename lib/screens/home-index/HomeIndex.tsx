import ReviewListItem from "@components/ReviewListItem";
import SuspenseFallback from "@components/SuspenseFallback";
import { Box, Text, View } from "@gluestack-ui/themed";
import { NWIcon } from "@lib/components/nativeWindInterop";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@lib/components/ui/card";
import { NAV_THEME } from "@lib/constants";
import { useColorScheme } from "@lib/useColorScheme";
import { FlashList } from "@shopify/flash-list";
import { trpc } from "@utils/trpc";
import { Attestation, isReviewItem } from "@utils/types";
import { format, parseISO } from "date-fns";
import { useRouter } from "expo-router";
import React, { Suspense, useMemo } from "react";
import { Platform, Pressable } from "react-native";
import { useActiveAccount } from "thirdweb/react";

const Index = () => {
  const user = useActiveAccount();

  const { isDarkColorScheme } = useColorScheme();
  const router = useRouter();
  const theme = NAV_THEME[isDarkColorScheme ? "dark" : "light"];

  const [attestations, { refetch, isRefetching }] =
    trpc.attestations.useSuspenseQuery({
      recipients: [user?.address ?? ""],
      attesters: [user?.address ?? ""],
    });

  const sortedAndGroupedList = useMemo(() => {
    const groups =
      attestations?.reduce((acc, item) => {
        const date = format(new Date(item.timeCreated * 1000), "yyyy-MM-dd");
        if (!acc[date]) {
          acc[date] = [];
        }
        // @ts-ignore
        acc[date].push({ ...item, timeCreated: date });
        return acc;
      }, {} as Record<string, Attestation[]>) ?? {};

    return Object.entries(groups).sort(
      ([date1], [date2]) => -date1.localeCompare(date2)
    );
  }, [attestations]);

  return (
    <View className="bg-background px-2 flex-1">
      <Text color="$textLight600" my="$4" size="lg" bold>
        All Activity
      </Text>
      <Suspense fallback={<SuspenseFallback />}>
        <FlashList
          onRefresh={refetch}
          refreshing={isRefetching}
          numColumns={1}
          estimatedItemSize={88}
          data={sortedAndGroupedList}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <Box h="$4" />}
          ListEmptyComponent={
            <Pressable onPress={() => router.navigate("/gettingStarted")}>
              <Card className="w-full bg-secondary  flex-row justify-between items-center">
                <CardHeader>
                  <CardTitle className="color-secondary-foreground">
                    Get started here!
                  </CardTitle>
                  <CardDescription className="color-secondary-foreground">
                    We will show you want you can do!
                  </CardDescription>
                </CardHeader>
                <CardHeader>
                  <View>
                    <NWIcon
                      tintColor={theme.border}
                      name={
                        Platform.OS === "ios"
                          ? "chevron.right.circle.fill"
                          : "circle-chevron-right"
                      }
                      color={theme.text}
                      size={24}
                    />
                  </View>
                </CardHeader>
              </Card>
            </Pressable>
          }
          renderItem={({ item }) => {
            const [date, items] = item;

            return isReviewItem(items[0]?.data) ? (
              <Box>
                <Text pb="$2" size="md" bold>
                  {format(parseISO(date), "MMMM do, yyyy")}
                </Text>
                {items.map((subItem, index) => {
                  const isUserAttester =
                    user?.address ===
                    (typeof subItem.attester === "object"
                      ? subItem.attester.address
                      : subItem.attester);

                  const itemUser = isUserAttester
                    ? subItem.recipient
                    : subItem.attester;

                  const avatarUri =
                    typeof itemUser === "object"
                      ? itemUser.image_url
                      : undefined;
                  const userName =
                    typeof itemUser === "object" ? itemUser.title : itemUser;

                  return (
                    <Box pb="$2" key={index}>
                      <ReviewListItem
                        avatarUri={avatarUri ?? undefined}
                        userAttested={isUserAttester}
                        userName={userName ?? undefined}
                        rating={subItem.data?.rating ?? 0}
                        comment={subItem.data?.comment ?? ""}
                        id={subItem.id}
                      />
                    </Box>
                  );
                })}
              </Box>
            ) : null;
          }}
        />
      </Suspense>
    </View>
  );
};

export default Index;
