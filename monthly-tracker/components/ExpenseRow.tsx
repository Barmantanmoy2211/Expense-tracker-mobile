import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { formatMoney, formatShortDate } from '@/lib/format';
import type { ExpenseWithCategory } from '@/lib/types';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type Props = {
  expense: ExpenseWithCategory;
  currencyCode: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export function ExpenseRow({ expense, currencyCode, onEdit, onDelete }: Props) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  const confirmDelete = () => {
    Alert.alert('Delete expense?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(expense.id) },
    ]);
  };

  return (
    <View style={[styles.row, { borderBottomColor: scheme === 'dark' ? '#333' : '#eee' }]}>
      <View style={[styles.dot, { backgroundColor: expense.categoryColor }]} />
      <Pressable style={styles.main} onLongPress={confirmDelete}>
        <Text style={[styles.title, { color: colors.text }]}>{expense.categoryName}</Text>
        {expense.note ? (
          <Text style={[styles.note, { color: colors.tabIconDefault }]} numberOfLines={1}>
            {expense.note}
          </Text>
        ) : null}
      </Pressable>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: colors.text }]}>
          {formatMoney(expense.amount, currencyCode)}
        </Text>
        <Text style={[styles.date, { color: colors.tabIconDefault }]}>
          {formatShortDate(expense.spentAt)}
        </Text>
      </View>
      <Pressable
        onPress={() => onEdit(expense.id)}
        style={({ pressed }) => [styles.editBtn, pressed && styles.pressed]}
        accessibilityLabel="Edit expense">
        <Text style={styles.editText}>Edit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  main: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    fontSize: 13,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
    marginRight: 10,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    marginTop: 2,
  },
  editBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#2563eb22',
  },
  editText: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.6,
  },
});
