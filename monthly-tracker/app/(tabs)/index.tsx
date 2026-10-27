import { useCallback } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { PeriodControls } from '@/components/PeriodControls';
import { useColorScheme } from '@/components/useColorScheme';
import { useTracker } from '@/context/TrackerContext';
import Colors from '@/constants/Colors';
import { formatMoney } from '@/lib/format';
import { periodTotalLabel } from '@/lib/period';

export default function OverviewScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const {
    ready,
    error,
    period,
    setPeriod,
    anchorDate,
    customRange,
    setCustomRange,
    goPrevPeriod,
    goNextPeriod,
    periodTotalAmount,
    categoryTotals,
    settings,
    refresh,
  } = useTracker();

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  if (!ready) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.tint} />
      </View>
    );
  }

  const maxCat = categoryTotals[0]?.total ?? 1;

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}>
      <PeriodControls
        period={period}
        onPeriodChange={setPeriod}
        anchorDate={anchorDate}
        customRange={customRange}
        onCustomRangeChange={setCustomRange}
        onPrev={goPrevPeriod}
        onNext={goNextPeriod}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={[styles.card, { backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#f4f6f8' }]}>
        <Text style={[styles.cardLabel, { color: colors.tabIconDefault }]}>
          {periodTotalLabel(period)}
        </Text>
        <Text style={[styles.total, { color: colors.text }]}>
          {formatMoney(periodTotalAmount, settings.currencyCode)}
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>By category</Text>
      {categoryTotals.length === 0 ? (
        <Text style={[styles.empty, { color: colors.tabIconDefault }]}>
          No expenses in this period. Add one from the Add tab.
        </Text>
      ) : (
        categoryTotals.map((cat) => (
          <View key={cat.categoryId} style={styles.catRow}>
            <View style={styles.catHeader}>
              <View style={[styles.catDot, { backgroundColor: cat.color }]} />
              <Text style={[styles.catName, { color: colors.text }]}>{cat.name}</Text>
              <Text style={[styles.catAmount, { color: colors.text }]}>
                {formatMoney(cat.total, settings.currencyCode)}
              </Text>
            </View>
            <View style={[styles.barTrack, { backgroundColor: scheme === 'dark' ? '#333' : '#e5e7eb' }]}>
              <View
                style={[
                  styles.barFill,
                  { backgroundColor: cat.color, width: `${Math.max(8, (cat.total / maxCat) * 100)}%` },
                ]}
              />
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: '#ef4444',
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    marginBottom: 24,
  },
  cardLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  total: {
    fontSize: 36,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  empty: {
    fontSize: 15,
    lineHeight: 22,
  },
  catRow: {
    marginBottom: 16,
  },
  catHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  catDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  catName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  catAmount: {
    fontSize: 15,
    fontWeight: '600',
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
});
