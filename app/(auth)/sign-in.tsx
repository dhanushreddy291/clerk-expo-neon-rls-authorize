import { View, Text, Pressable } from "react-native";
import * as AuthSession from "expo-auth-session";
import { useSSO } from "@clerk/clerk-expo";
import { AntDesign } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { useColorScheme } from "react-native";

export default function SignInScreen() {
  const { isSignedIn, isLoaded } = useAuth();
  const { startSSOFlow } = useSSO();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  if (isLoaded && isSignedIn) {
    return <Redirect href="/" />;
  }

  const signInWithOauth = async (strategy: "google") => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: `oauth_${strategy}`,
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isDarkMode ? "#181818" : "#F9F9F9",
      }}
    >
      <View
        style={{
          padding: 20,
          borderRadius: 12,
          backgroundColor: isDarkMode ? "#222" : "#fff",
          shadowColor: isDarkMode ? "#000" : "#CCC",
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: 5,
          width: 300,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: isDarkMode ? "#EAEAEA" : "#333",
            marginBottom: 16,
          }}
        >
          Sign in
        </Text>

        <Pressable
          onPress={() => signInWithOauth("google")}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: pressed
              ? isDarkMode
                ? "#CCC"
                : "#DDD"
              : "#FFF",
            borderColor: isDarkMode ? "#444" : "#DDD",
            borderWidth: 1,
            borderRadius: 8,
            paddingVertical: 10,
            width: 260,
          })}
        >
          <AntDesign name="google" size={16} color={isDarkMode ? "#444" : "#777"} />
          <Text
            style={{
              fontWeight: "600",
              color: isDarkMode ? "#222" : "#333",
              marginLeft: 8,
            }}
          >
            Continue with Google
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
