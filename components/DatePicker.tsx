import DatePicker, {
  DatePickerProps as RNDatePickerProps,
} from "react-native-date-picker";
import { useStyles } from "react-native-unistyles";

interface DatePickerProps
  extends Omit<
    RNDatePickerProps,
    "date" | "maximumDate" | "minimumDate" | "onConfirm"
  > {
  date: Temporal.ZonedDateTime;
  maximumDate?: Temporal.ZonedDateTime;
  minimumDate?: Temporal.ZonedDateTime;
  onConfirm?: (date: Temporal.ZonedDateTime) => void;
}

const CustomDatePicker = ({
  date: inputDate,
  maximumDate,
  minimumDate,
  modal = true,
  buttonColor,
  onConfirm,
  ...rest
}: DatePickerProps) => {
  const { theme } = useStyles();

  const confirmDate = (date: Date) => {
    if (onConfirm) {
      const temporalDate = date
        .toTemporalInstant()
        .toZonedDateTimeISO(Temporal.Now.timeZoneId());
      onConfirm(temporalDate);
    }
  };

  return (
    <DatePicker
      modal={modal}
      date={new Date(inputDate.epochMilliseconds)}
      maximumDate={
        maximumDate ? new Date(maximumDate.epochMilliseconds) : undefined
      }
      minimumDate={
        minimumDate ? new Date(minimumDate.epochMilliseconds) : undefined
      }
      buttonColor={buttonColor ?? theme.colors.text}
      onConfirm={confirmDate}
      {...rest}
    />
  );
};

export default CustomDatePicker;
