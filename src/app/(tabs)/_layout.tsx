import { Tabs } from 'expo-router/js-tabs';

// Tabs have text labels only so the template needs no icon dependency.
// To add icons, install one with `npx expo install expo-symbols` or `@expo/vector-icons`
// and set `tabBarIcon` per screen.
export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarIcon: () => null, tabBarLabelStyle: { fontSize: 15 } }}>
      <Tabs.Screen name="index" options={{ title: 'Posts' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
