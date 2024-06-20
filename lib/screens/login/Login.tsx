import { Spinner } from "@gluestack-ui/themed";
import MainButton from "@lib/components/MainButton";
import ConnectWallet from "@lib/components/connect-modal-v5";
import { Button } from "@lib/components/ui/button";
import * as Typo from "@lib/components/ui/typography";
import { NAV_THEME } from "@lib/constants";
import { thirdwebClient, wallets } from "@lib/services/thirdwebClient";
import { useColorScheme } from "@lib/useColorScheme";
import { trpc } from "@lib/utils/trpc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { skipToken } from "@tanstack/react-query";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { signLoginPayload } from "thirdweb/auth";
import {
  useActiveAccount,
  useActiveWallet,
  useAutoConnect,
} from "thirdweb/react";
import { P, match } from "ts-pattern";

export default function LoginScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const tTheme = NAV_THEME[isDarkColorScheme ? "dark" : "light"];
  const params = useLocalSearchParams<{ rUrl: string }>();
  const wallet = useActiveWallet();

  const [jwt, setJwt] = useState<string | null>(null);
  const account = useActiveAccount();

  const { isLoading, error } = useAutoConnect({
    client: thirdwebClient,
    wallets,
  });
  useEffect(() => {
    (async () => {
      const jwt = await AsyncStorage.getItem("auth_token_storage_key");
      refetch();
      setJwt(jwt);
    })();
  }, []);

  const { data: isLoggedIn, refetch } = trpc.isLoggedIn.useQuery(jwt);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/(tabs)/(home)/");
    }
  }, [isLoggedIn]);

  const { mutateAsync: initLogin } = trpc.login.useMutation();
  const { mutateAsync: verifyLoginPayload } =
    trpc.verifyLoginPayload.useMutation();

  const login = async () => {
    if (!account?.address) return;

    try {
      const loginPayload = await initLogin({
        address: account?.address,
        chainId: wallet?.getChain()?.id,
      });

      const signature = await signLoginPayload({
        payload: loginPayload!,
        account: account,
      });

      const jwt = await verifyLoginPayload(signature);
      if (jwt) {
        await AsyncStorage.setItem("auth_token_storage_key", jwt);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const logout = () => {
    AsyncStorage.removeItem("auth_token_storage_key");
  };

  return (
    <View className="flex-1 justify-center items-center gap-4 bg-background">
      <Typo.H1 className="color-primary">ChainCred</Typo.H1>
      <Typo.Lead>An app for reviewing decentralized</Typo.Lead>
      <ConnectWallet />
    </View>
  );
}
