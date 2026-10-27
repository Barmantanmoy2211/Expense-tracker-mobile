import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatMonthLabel } from '@/lib/month';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type Props = {
  year: number;
  monthIndex: number;
  onPrev: () => void;
  onNext: () => void;
};

export function MonthPicker({ year, monthIndex, onPrev, onNext }: Props) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  return (
    <View style={styles.row}>
      <Pressable
        onPress={onPrev}
        style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}
        accessibilityLabel="Previous month">
        <Text style={[styles.arrowText, { color: colors.tint }]}>‹</Text>
      </Pressable>
      <Text style={[styles.label, { color: colors.text }]}>{formatMonthLabel(year, monthIndex)}</Text>
      <Pressable
        onPress={onNext}
        style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}
        accessibilityLabel="Next month">
        <Text style={[styles.arrowText, { color: colors.tint }]}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  arrow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  arrowText: {
    fontSize: 28,
    fontWeight: '300',
  },
  pressed: {
    opacity: 0.5,
  },
});
