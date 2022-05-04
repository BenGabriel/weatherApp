import { StyleSheet, Text } from "react-native";
import React, { FC } from "react";

type Props = {
  text: string;
  bold?: boolean;
  size?: number;
  color?: string;
  style?: any;
};
const Typography: FC<Props> = ({ text, bold, size, style, color }) => {
  return (
    <Text
      style={{
        fontWeight: bold ? "bold" : "400",
        color: color ? color : "#333",
        fontSize: size ? size : 16,
        textTransform:'uppercase',
        ...style
      }}
    >
      {text}
    </Text>
  );
};

export default Typography;

const styles = StyleSheet.create({});
