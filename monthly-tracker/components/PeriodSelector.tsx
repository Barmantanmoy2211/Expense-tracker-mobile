import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { OVERVIEW_PERIODS, type OverviewPeriod } from '@/lib/period';

type Props = {
  value: OverviewPeriod;
  onChange: (period: OverviewPeriod) => void;
};

export function PeriodSelector({ value, onChange }: Props) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {OVERVIEW_PERIODS.map((p) => {
        const selected = value === p.id;
        return (
          <Pressable
            key={p.id}
            onPress={() => onChange(p.id)}
            style={[
              styles.chip,
              {
                backgroundColor: selected ? '#2563eb' : scheme === 'dark' ? '#1a1a1a' : '#f4f6f8',
                borderColor: selected ? '#2563eb' : colors.tabIconDefault,
              },
            ]}>
            <Text style={[styles.chipText, { color: selected ? '#fff' : colors.text }]}>{p.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
