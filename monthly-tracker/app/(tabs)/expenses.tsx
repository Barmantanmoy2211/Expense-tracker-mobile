import { useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import { ExpenseRow } from '@/components/ExpenseRow';
import { PeriodControls } from '@/components/PeriodControls';
import { useColorScheme } from '@/components/useColorScheme';
import { useTracker } from '@/context/TrackerContext';
import Colors from '@/constants/Colors';

export default function ExpensesScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const router = useRouter();
  const {
    ready,
    period,
    setPeriod,
    anchorDate,
    customRange,
    setCustomRange,
    goPrevPeriod,
    goNextPeriod,
    expenses,
    settings,
    refresh,
    removeExpense,
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <PeriodControls
          period={period}
          onPeriodChange={setPeriod}
          anchorDate={anchorDate}
          customRange={customRange}
          onCustomRangeChange={setCustomRange}
          onPrev={goPrevPeriod}
          onNext={goNextPeriod}
        />
        <Text style={[styles.hint, { color: colors.tabIconDefault }]}>Long-press a row to delete</Text>
      </View>
      <FlatList
        data={expenses}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={expenses.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.tabIconDefault }]}>No expenses in this period.</Text>
        }
        renderItem={({ item }) => (
          <ExpenseRow
            expense={item}
            currencyCode={settings.currencyCode}
            onEdit={(id) => router.push(`/expense/${id}`)}
            onDelete={(id) => void removeExpense(id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hint: {
    fontSize: 12,
    marginBottom: 8,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  emptyList: {
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  empty: {
    textAlign: 'center',
    fontSize: 15,
  },
});
