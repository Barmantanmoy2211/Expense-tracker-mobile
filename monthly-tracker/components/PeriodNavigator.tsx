import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { defaultCustomRange, formatPeriodLabel, type OverviewPeriod } from '@/lib/period';

type Props = {
  period: OverviewPeriod;
  anchor: Date;
  onPrev: () => void;
  onNext: () => void;
};

export function PeriodNavigator({ period, anchor, onPrev, onNext }: Props) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  return (
    <View style={styles.row}>
      <Pressable
        onPress={onPrev}
        style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}
        accessibilityLabel="Previous period">
        <Text style={[styles.arrowText, { color: colors.tint }]}>‹</Text>
      </Pressable>
      <Text style={[styles.label, { color: colors.text }]} numberOfLines={2}>
        {formatPeriodLabel(period, anchor, defaultCustomRange())}
      </Text>
      <Pressable
        onPress={onNext}
        style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}
        accessibilityLabel="Next period">
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
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 8,
  },
  arrow: {
    paddingHorizontal: 12,
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
