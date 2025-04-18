import DatePicker, {
  DatePickerProps as RNDatePickerProps,
} from "react-native-date-picker";
import { useStyles } from "react-native-unistyles";

interface DatePickerProps
  extends Omit<
    RNDatePickerProps,
    "date" | "maximumDate" | "minimumDate" | "onConfirm"
  > {
  date: Temporal.PlainDateTime;
  maximumDate?: Temporal.PlainDateTime;
  minimumDate?: Temporal.PlainDateTime;
  onConfirm?: (date: Temporal.PlainDateTime) => void;
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
      // const temporalDate = date
      //   .toTemporalInstant()
      //   .toZonedDateTimeISO(Temporal.Now.timeZoneId());
      const temporalDate = Temporal.PlainDateTime.from(date.toString());
      onConfirm(temporalDate);
    }
  };

  return (
    <DatePicker
      modal={modal}
      date={new Date(inputDate.millisecond)}
      maximumDate={
        maximumDate ? new Date(maximumDate.millisecond) : undefined
      }
      minimumDate={
        minimumDate ? new Date(minimumDate.millisecond) : undefined
      }
      buttonColor={buttonColor ?? theme.colors.text}
      onConfirm={confirmDate}
      {...rest}
    />
  );
};

export default CustomDatePicker;
