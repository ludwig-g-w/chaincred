import { NWSymbolView } from "@lib/components/nativeWindInterop";
import { Label } from "@lib/components/ui/label";
import * as Typo from "@lib/components/ui/typography";
import { NAV_THEME } from "@lib/constants";
import { useColorScheme } from "@lib/useColorScheme";
import React, { ReactElement } from "react";
import { Pressable, View } from "react-native";

type EditableFieldProps = {
  label: string;
  isEditing: boolean;
  onSave: () => void;
  profileValue?: string | null;
  setEditing: Function;
  children: ReactElement;
};

export const EditableField = ({
  label,
  isEditing,
  onSave,
  profileValue,
  setEditing,
  children,
}: EditableFieldProps) => {
  const { isDarkColorScheme } = useColorScheme();
  const theme = NAV_THEME[isDarkColorScheme ? "dark" : "light"];
  return (
    <>
      <Label nativeID="asdsa">{label}</Label>
      <View className="flex-row w-full justify-between items-center min-h-12 gap-4">
        {isEditing ? (
          <>
            <View flex={1}>{children}</View>
            <Pressable onPress={onSave}>
              <NWSymbolView
                className="w-8 h-10 aspect-square"
                name="checkmark.circle.fill"
                type="hierarchical"
                tintColor={theme.primary}
              />
            </Pressable>
          </>
        ) : (
          <>
            <Typo.Lead>{profileValue || `No ${label.toLowerCase()}`}</Typo.Lead>
            <Pressable
              onPress={() =>
                setEditing((prev: any) => ({
                  ...prev,
                  [label.toLowerCase()]: true,
                }))
              }
            >
              <NWSymbolView
                name="pencil.circle.fill"
                type="hierarchical"
                tintColor={theme.primary}
                className="w-8 h-10 aspect-square"
              />
            </Pressable>
          </>
        )}
      </View>
    </>
  );
};
