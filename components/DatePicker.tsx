import DatePicker, {
  type DatePickerProps as RNDatePickerProps,
} from "react-native-date-picker";
import { withUnistyles } from "react-native-unistyles";

interface DatePickerProps
  extends Omit<
    RNDatePickerProps,
    "date" | "maximumDate" | "minimumDate" | "onConfirm" | "mode"
  > {
  date: Temporal.PlainDate;
  maximumDate?: Temporal.PlainDate;
  minimumDate?: Temporal.PlainDate;
  onConfirm?: (date: Temporal.PlainDate) => void;
}

const UniDatePicker = withUnistyles(DatePicker);

const DateTimePicker = ({
  date: inputDate,
  maximumDate,
  minimumDate,
  modal = true,
  buttonColor,
  onConfirm,
  ...rest
}: DatePickerProps) => {
  const confirmDate = (date: Date) => {
    const temporalDate = date
      .toTemporalInstant()
      .toZonedDateTimeISO(Temporal.Now.timeZoneId())
      .toPlainDate();
    onConfirm?.(temporalDate);
  };

  return (
    <UniDatePicker
      modal={modal}
      date={new Date(inputDate.toString())}
      mode="date"
      maximumDate={maximumDate ? new Date(maximumDate.toString()) : undefined}
      minimumDate={minimumDate ? new Date(minimumDate.toString()) : undefined}
      onConfirm={confirmDate}
      uniProps={(theme) => ({
        buttonColor: buttonColor ?? theme.colors.text,
      })}
      {...rest}
    />
  );
};

export default DateTimePicker;
