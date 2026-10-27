import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { useTracker } from '@/context/TrackerContext';
import Colors from '@/constants/Colors';

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'] as const;

export default function SettingsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const { settings, updateCurrency } = useTracker();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Currency</Text>
      <Text style={[styles.sub, { color: colors.tabIconDefault }]}>
        Used for display only. All amounts are stored as numbers on your phone.
      </Text>
      <View style={styles.row}>
        {CURRENCIES.map((code) => {
          const selected = settings.currencyCode === code;
          return (
            <Pressable
              key={code}
              onPress={() => void updateCurrency(code)}
              style={[
                styles.option,
                {
                  borderColor: selected ? colors.tint : colors.tabIconDefault,
                  backgroundColor: selected ? colors.tint : 'transparent',
                },
              ]}>
              <Text style={{ color: selected ? '#fff' : colors.text, fontWeight: '600' }}>{code}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.footer, { color: colors.tabIconDefault }]}>
        Data stays on this device (offline). Scan the QR code from Expo on the same Wi‑Fi to open
        in Expo Go.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  sub: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  option: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  footer: {
    marginTop: 32,
    fontSize: 13,
    lineHeight: 20,
  },
});
