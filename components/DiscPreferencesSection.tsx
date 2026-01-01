import { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export type ThrowingHand = 'right' | 'left';

interface DiscPreferencesSectionProps {
  throwingHand: ThrowingHand;
  onThrowingHandChange: (hand: ThrowingHand) => void;
  saving?: boolean;
}

export default function DiscPreferencesSection({
  throwingHand,
  onThrowingHandChange,
  saving = false,
}: DiscPreferencesSectionProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleThrowingHandPress = useCallback(() => {
    Alert.alert(
      'Throwing Hand',
      'Select your primary throwing hand for flight path visualization',
      [
        {
          text: 'Right Hand',
          onPress: () => onThrowingHandChange('right'),
        },
        {
          text: 'Left Hand',
          onPress: () => onThrowingHandChange('left'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }, [onThrowingHandChange]);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Disc Preferences</Text>

      {/* Throwing Hand */}
      <View style={styles.editableRow}>
        <FontAwesome name="hand-paper-o" size={16} color="#666" style={styles.detailIcon} />
        <View style={styles.editableContent}>
          <Text style={styles.detailLabel}>Throwing Hand</Text>
          <TouchableOpacity
            style={styles.dropdownRow}
            onPress={handleThrowingHandPress}
            disabled={saving}>
            <Text style={styles.detailValue}>
              {throwingHand === 'right' ? 'Right Hand' : 'Left Hand'}
            </Text>
            <FontAwesome name="chevron-down" size={12} color="#999" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.2)',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#666',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  editableRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  detailIcon: {
    marginRight: 12,
  },
  editableContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
