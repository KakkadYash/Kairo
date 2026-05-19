import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";

import { theme } from "./src/constants/theme";
import { PlayerProvider } from "./src/context/PlayerContext";
import { LibraryScreen } from "./src/screens/LibraryScreen";

export default function App() {
  return (
    <PlayerProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <LibraryScreen />
      </SafeAreaView>
    </PlayerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
