import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0f0f0f',
          },
          headerTintColor: '#e0e0e0',
          headerTitleStyle: {
            fontSize: 32,
            fontWeight: '600',
          },
          tabBarStyle: {
            backgroundColor: '#0f0f0f',
            borderTopColor: '#252525',
          },
          tabBarActiveTintColor: '#4ade80',
          tabBarInactiveTintColor: '#666',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: () => <Text>⚡</Text>,
            title: '⚡ Benchmark',
            tabBarLabel: 'Benchmark',
          }}
        />
        <Tabs.Screen
          name="render"
          options={{
            tabBarIcon: () => <Text>📄</Text>,
            title: 'Markdown',
            tabBarLabel: 'Render',
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
});
