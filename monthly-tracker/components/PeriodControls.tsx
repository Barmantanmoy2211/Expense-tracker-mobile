import { StyleSheet, Text, View } from 'react-native';

import { CustomRangePicker } from '@/components/CustomRangePicker';
import { PeriodNavigator } from '@/components/PeriodNavigator';
import { PeriodSelector } from '@/components/PeriodSelector';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { formatPeriodLabel, type CustomDateRange, type OverviewPeriod } from '@/lib/period';

type Props = {
  period: OverviewPeriod;
  onPeriodChange: (period: OverviewPeriod) => void;
  anchorDate: Date;
  customRange: CustomDateRange;
  onCustomRangeChange: (range: CustomDateRange) => void;
  onPrev: () => void;
  onNext: () => void;
};

export function PeriodControls({
  period,
  onPeriodChange,
  anchorDate,
  customRange,
  onCustomRangeChange,
  onPrev,
  onNext,
}: Props) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  return (
    <View>
      <PeriodSelector value={period} onChange={onPeriodChange} />
      {period === 'custom' ? (
        <>
          <Text style={[styles.customTitle, { color: colors.text }]}>
            {formatPeriodLabel(period, anchorDate, customRange)}
          </Text>
          <CustomRangePicker range={customRange} onChange={onCustomRangeChange} />
        </>
      ) : (
        <PeriodNavigator period={period} anchor={anchorDate} onPrev={onPrev} onNext={onNext} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  customTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
});
