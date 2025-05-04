import TextInput from "@/components/TextInput";
import type { TextInput as RNTextInput } from "react-native-gesture-handler";
import { StyleSheet } from "react-native-unistyles";
import { View, Text } from "react-native";
import { useMemo, useRef, useState } from "react";
import Toggle from "@/components/Toggle";
import Icon from "@/components/Icon";
import Section from "@/components/Section";
import { isInteger, toNumber } from "@/utils/helpers";
import { OTCycle, Paycycle } from "@/utils/typescript";
import DatePicker from "./DatePicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Button from "./Button";

export interface FormFields {
  name: string;
  breakDuration: number;
  overtimeHours: number;
  overtimeMins: number;
  overtimeCycle: OTCycle;
  startDate: Temporal.PlainDate;
  paycyclePeriod: Paycycle;
  description: string;
  minShiftDurationMinutes: number;
}

interface JobFormProps {
  initialValues?: FormFields;
  disabledFields?: (keyof FormFields)[];
  onSubmit: (formData: FormFields) => Promise<void>;
  extraButton?: {
    text: string;
    onPress: () => void;
  };
  submitButtonText?: string;
}

const JobForm = ({
  initialValues = {
    name: "",
    breakDuration: 30,
    overtimeHours: 40,
    overtimeMins: 0,
    overtimeCycle: OTCycle.Week,
    paycyclePeriod: Paycycle.Biweekly,
    startDate: Temporal.Now.plainDateISO(),
    description: "",
    minShiftDurationMinutes: 180,
  },
  disabledFields = [],
  onSubmit,
  submitButtonText = "Confirm",
  extraButton,
}: JobFormProps) => {
  const [name, setName] = useState(initialValues.name);
  const [breakDuration, setBreakDuration] = useState(
    initialValues.breakDuration.toString(),
  );
  const [overtimeHours, setOvertimeHours] = useState(
    initialValues.overtimeHours.toString(),
  );
  const [overtimeMins, setOvertimeMins] = useState(
    initialValues.overtimeMins.toString(),
  );
  const [overtimeCycle, setOvertimeCycle] = useState(
    initialValues.overtimeCycle,
  );
  const [date, setDate] = useState(initialValues.startDate);

  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [paycyclePeriod, setPaycyclePeriod] = useState(
    initialValues.paycyclePeriod,
  );
  const [description, setDescription] = useState(initialValues.description);
  const [minShiftLengthMins, setMinShiftLengthMins] = useState(
    initialValues.minShiftDurationMinutes.toString(),
  );

  const validName = useMemo(() => /\w+/.test(name), [name]);
  const validBreak = useMemo(() => isInteger(breakDuration), [breakDuration]);
  const validOTCycle = useMemo(() => {
    if (overtimeCycle === OTCycle.Day) {
      const otHoursValid = isInteger(overtimeHours);
      const otMinsValid = isInteger(overtimeMins);
      let otHours = toNumber(overtimeHours);
      let otMins = toNumber(overtimeMins);
      if (otMins >= 60) {
        otHours++;
        otMins -= 60;
      }
      const totalMins = otHours * 60 + otMins;
      return otHoursValid && otMinsValid && totalMins < 60 * 24;
    }
    return true;
  }, [overtimeCycle, overtimeHours, overtimeMins]);
  const validOTHours = useMemo(
    () => isInteger(overtimeHours) && validOTCycle,
    [overtimeHours, validOTCycle],
  );
  const validOTMins = useMemo(
    () => isInteger(overtimeMins) && validOTCycle,
    [overtimeMins, validOTCycle],
  );
  const validMinShiftLength = useMemo(
    () => isInteger(minShiftLengthMins),
    [minShiftLengthMins],
  );

  const nameRef = useRef<RNTextInput>(null);
  const breakRef = useRef<RNTextInput>(null);
  const hoursRef = useRef<RNTextInput>(null);
  const minutesRef = useRef<RNTextInput>(null);
  const shiftLenghtRef = useRef<RNTextInput>(null);

  const submitForm = async () => {
    if (
      validName &&
      validMinShiftLength &&
      validOTMins &&
      validOTHours &&
      validOTCycle &&
      validBreak
    ) {
      await onSubmit({
        name,
        startDate: date,
        description,
        overtimeCycle,
        overtimeMins: toNumber(overtimeMins),
        overtimeHours: toNumber(overtimeHours),
        paycyclePeriod,
        breakDuration: toNumber(breakDuration),
        minShiftDurationMinutes: toNumber(minShiftLengthMins),
      });
    }
    !validName && nameRef.current?.focus();
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={[styles.container]}>
      <Section title="Name" titleStyle={styles.sectionTitle}>
        <TextInput
          ref={nameRef}
          errorMessage="This field is required"
          error={!validName}
          onChangeText={setName}
          value={name}
          onSubmitEditing={() => breakRef.current?.focus()}
        />
      </Section>
      <Section title="Break Deduction" titleStyle={styles.sectionTitle}>
        <View style={styles.horizontal}>
          <TextInput
            ref={breakRef}
            error={!validBreak}
            errorMessage=""
            keyboardType="numeric"
            maxLength={3}
            onChangeText={setBreakDuration}
            onSubmitEditing={() => hoursRef.current?.focus()}
            placeholder="?"
            style={styles.timeInput}
            value={breakDuration}
          />
          <Text style={styles.supportingText}>min(s)</Text>
        </View>
      </Section>
      <Section
        title="Overtime"
        titleStyle={styles.sectionTitle}
        style={styles.section}
      >
        <Text style={styles.supportingText}>You receive overtime after</Text>
        <View style={styles.horizontal}>
          <TextInput
            ref={hoursRef}
            error={!validOTHours}
            errorMessage=""
            keyboardType="numeric"
            maxLength={2}
            onChangeText={setOvertimeHours}
            onSubmitEditing={() => minutesRef.current?.focus()}
            placeholder="?"
            style={styles.timeInput}
            value={overtimeHours}
          />
          <Text style={styles.importantText}>hours</Text>
          <TextInput
            ref={minutesRef}
            error={!validOTMins}
            errorMessage=""
            keyboardType="numeric"
            maxLength={2}
            onChangeText={setOvertimeMins}
            placeholder="?"
            style={styles.timeInput}
            value={overtimeMins}
          />
          <Text style={styles.importantText}>minutes</Text>
        </View>
        <Text style={styles.supportingText}>within one</Text>
        <Toggle
          firstValue={OTCycle.Week}
          secondValue={OTCycle.Day}
          firstLabel="Week"
          secondLabel="Day"
          buttonWidth={75}
          onPressLeft={setOvertimeCycle}
          onPressRight={setOvertimeCycle}
        />
        {!validOTCycle && (
          <Text style={styles.error}>
            Cannot work more than 24 hours in a day
          </Text>
        )}
      </Section>
      <Section title="Minimum Shift Length" titleStyle={styles.sectionTitle}>
        <View style={styles.horizontal}>
          <TextInput
            ref={shiftLenghtRef}
            error={!validMinShiftLength}
            errorMessage=""
            keyboardType="numeric"
            maxLength={3}
            onChangeText={setMinShiftLengthMins}
            placeholder="?"
            style={styles.timeInput}
            value={minShiftLengthMins}
          />
          <Text style={styles.supportingText}>min(s)</Text>
        </View>
      </Section>
      {disabledFields.includes("startDate") || (
        <Section title="Paycycle Start Date" titleStyle={styles.sectionTitle}>
          <Text style={styles.supportingText}>
            Select the current or previous paycycle start date
          </Text>
          <View style={[styles.horizontal, styles.dateContainer]}>
            <Button
              style={styles.dateButton}
              onPress={() => setDateModalOpen(true)}
            >
              <Icon name="calendar" />
              <Text style={styles.dateText}>{date.toLocaleString()}</Text>
            </Button>
            <DatePicker
              open={dateModalOpen}
              title={"Paycycle Start Date"}
              minimumDate={Temporal.PlainDate.from(date).subtract({
                months: 1,
              })}
              maximumDate={Temporal.PlainDate.from(date)}
              date={Temporal.PlainDate.from(date)}
              onConfirm={(date) => {
                setDateModalOpen(false);
                setDate(date);
              }}
              onCancel={() => {
                setDateModalOpen(false);
              }}
            />
            <Icon name="arrow-right" style={styles.disabled} />
            <Button
              style={[styles.dateButton, styles.disabled]}
              enabled={false}
            >
              <Icon name="calendar" style={styles.disabled} />
              <Text style={[styles.dateText, styles.disabled]}>
                {date.add({ days: paycyclePeriod - 1 }).toLocaleString()}
              </Text>
            </Button>
          </View>
          <Text style={styles.supportingText}>Pay Cycle</Text>
          <Toggle
            firstValue={Paycycle.Biweekly}
            secondValue={Paycycle.Weekly}
            firstLabel="Bi-weekly"
            secondLabel="Weekly"
            buttonWidth={100}
            onPressLeft={setPaycyclePeriod}
            onPressRight={setPaycyclePeriod}
          />
        </Section>
      )}
      <Section title="Comments" titleStyle={styles.sectionTitle}>
        <TextInput
          value={description}
          onChangeText={setDescription}
          style={{ width: "auto" }}
          multiline
        />
      </Section>
      <View style={styles.buttonContainer}>
        {extraButton && (
          <Button
            style={[styles.button, styles.delete]}
            onPress={extraButton.onPress}
          >
            <Icon name="trash-2" />
            <Text style={styles.buttonText}>{extraButton.text}</Text>
          </Button>
        )}
        <Button
          style={[
            styles.button,
            !extraButton && {
              flex: 0,
            },
          ]}
          onPress={submitForm}
        >
          <Icon name="check" />
          <Text style={styles.buttonText}>{submitButtonText}</Text>
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
};

export const styles = StyleSheet.create((theme, rt) => ({
  horizontal: {
    flexDirection: "row",
    gap: theme.spacing[1],
    alignItems: "center",
  },
  timeInput: {
    width: theme.sizes[14],
    paddingHorizontal: theme.spacing[2],
    textAlign: "center",
  },
  supportingText: {
    color: theme.colors.slate10,
    fontSize: theme.sizes[4],
  },
  importantText: {
    color: theme.colors.slate11,
    fontSize: theme.sizes[4],
    fontWeight: "bold",
  },
  container: {
    paddingHorizontal: theme.spacing[4],
    paddingBlockStart: theme.spacing[3],
    paddingBlockEnd: theme.spacing[3] + rt.navigationBar.height,
    gap: theme.spacing[2],
  },
  buttonText: {
    color: theme.colors.text,
    fontWeight: "bold",
    fontSize: theme.sizes[5],
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing[2],
    backgroundColor: theme.colors.success,
    borderWidth: theme.borderWidths.none,
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[4],
  },
  dateText: {
    color: theme.colors.text,
    fontWeight: "bold",
  },
  sectionTitle: {
    marginBlockEnd: theme.spacing[1],
    marginInlineStart: theme.spacing[1],
  },
  error: {
    color: theme.colors.error,
  },
  delete: {
    backgroundColor: theme.colors.error,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: theme.spacing[4],
    marginTop: theme.spacing[2],
    alignItems: "center",
    justifyContent: "center",
  },
  dateButton: {
    gap: theme.spacing[2],
    backgroundColor: theme.colors.transparent,
    borderWidth: theme.borderWidths.thin,
    borderColor: theme.colors.slate7,
    borderRadius: theme.radii["2xl"],
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
  },
  dateContainer: {
    gap: theme.spacing[2],
  },
  disabled: {
    color: theme.colors.textSecondary,
    borderColor: theme.colors.slate6,
  },
  section: {
    gap: theme.spacing[1],
  },
}));

export default JobForm;
