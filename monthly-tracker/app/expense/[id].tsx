import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { ExpenseForm } from '@/components/ExpenseForm';
import { useColorScheme } from '@/components/useColorScheme';
import { useTracker } from '@/context/TrackerContext';
import Colors from '@/constants/Colors';
import { getExpenseById } from '@/lib/repository';
import type { ExpenseWithCategory } from '@/lib/types';

export default function EditExpenseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const expenseId = Number(id);
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const { ready, categories, editExpense, settings } = useTracker();
  const [expense, setExpense] = useState<ExpenseWithCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!expenseId || Number.isNaN(expenseId)) {
        setLoading(false);
        return;
      }
      const row = await getExpenseById(expenseId);
      if (!cancelled) {
        setExpense(row);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [expenseId]);

  if (!ready || loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Edit expense', presentation: 'modal' }} />
        <ActivityIndicator color={colors.tint} />
      </View>
    );
  }

  if (!expense) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Edit expense', presentation: 'modal' }} />
        <Text style={{ color: colors.text }}>Expense not found.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Edit expense', presentation: 'modal' }} />
      <ExpenseForm
        categories={categories}
        currencyCode={settings.currencyCode}
        initialAmount={String(expense.amount)}
        initialCategoryId={expense.categoryId}
        initialNote={expense.note ?? ''}
        initialDate={new Date(expense.spentAt)}
        submitLabel="Save changes"
        saving={saving}
        onSubmit={async (values) => {
          setSaving(true);
          try {
            await editExpense(expense.id, values);
            Alert.alert('Updated', 'Expense saved.');
            router.back();
          } catch {
            Alert.alert('Error', 'Could not save. Try again.');
          } finally {
            setSaving(false);
          }
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
