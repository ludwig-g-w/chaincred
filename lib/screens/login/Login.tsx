import ConnectWallet from "@lib/components/connect-modal-v5";
import * as Typo from "@lib/components/ui/typography";
import { NAV_THEME } from "@lib/constants";
import { thirdwebClient, wallets } from "@lib/services/thirdwebClient";
import { useColorScheme } from "@lib/useColorScheme";
import { trpc } from "@lib/utils/trpc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";
import { sepolia } from "thirdweb/chains";

import { ConnectButton } from "thirdweb/react";

export default function LoginScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const tTheme = NAV_THEME[isDarkColorScheme ? "dark" : "light"];
  const params = useLocalSearchParams<{ rUrl: string }>();
  const utils = trpc.useUtils();
  const { mutateAsync: verifyLoginPayload } =
    trpc.verifyLoginPayload.useMutation();
  const { mutateAsync: generatePayload } = trpc.generatePayload.useMutation();

  const logout = () => {
    AsyncStorage.removeItem("auth_token_storage_key");
  };

  return (
    <View className="flex-1 justify-center items-center gap-4 bg-background">
      <Typo.H1 className="color-primary">ChainCred</Typo.H1>
      <Typo.Lead>An app for reviewing decentralized</Typo.Lead>
      <ConnectButton
        client={thirdwebClient}
        wallets={wallets}
        chain={sepolia}
        auth={{
          isLoggedIn: async () => {
            const jwt = await AsyncStorage.getItem("auth_token_storage_key");
            if (!jwt) return false;
            const isLoggedIn = await utils.isLoggedIn.fetch(jwt);
            return isLoggedIn;
          },
          doLogin: async (params) => {
            const jwt = await verifyLoginPayload(params);
            console.log("jwt", jwt);
            if (jwt) {
              await AsyncStorage.setItem("auth_token_storage_key", jwt);
              router.replace("/(tabs)/(home)/");
            }
          },
          getLoginPayload: async (payload) => generatePayload(payload),
          doLogout: async () => {
            await logout();
          },
        }}
      />
    </View>
  );
}
