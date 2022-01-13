import { ReactElement, useState } from 'react';
import { Platform, StyleSheet, View, ViewProps } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { Coordinate } from 'src/types/constants';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

type RippleButtonProps = {
  onPress?: () => void;
  onLongPress?: () => void;
  rippleColor?: string;
  children?: ReactElement<ViewProps>;
  longPressHitSlop?: number;
  hitSlop?: number;
};

const dist = (p1: Coordinate, p2: Coordinate) => {
  'worklet';
  const xDiff = p2.x - p1.x;
  const yDiff = p2.y - p1.y;
  return Math.sqrt(xDiff ** 2 + yDiff ** 2);
};

const RippleButton = ({
  onPress,
  onLongPress,
  rippleColor = '#FFFFFF',
  children,
  longPressHitSlop = 20,
  hitSlop = 10,
}: RippleButtonProps) => {
  const translation = useSharedValue({ x: 0, y: 0 });
  const scale = useSharedValue(0);
  const underlayOpacity = useSharedValue(0);
  const opacity = useSharedValue(1);
  const [radius, setRadius] = useState(-1);

  const animatedAndroidStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -radius + translation.value.x },
      { translateY: -radius + translation.value.y },
      { scale: scale.value },
    ],
    opacity: underlayOpacity.value,
  }));

  const AnimatediOSStyle = useAnimatedStyle(() => ({
    opacity: Platform.OS === 'ios' ? opacity.value : 1,
  }));

  const gesture = Gesture.LongPress()
    .hitSlop(hitSlop)
    .maxDistance(radius)
    .shouldCancelWhenOutside(true)
    .onBegin(event => {
      translation.value = { x: event.x, y: event.y };
      scale.value = withTiming(1);
      underlayOpacity.value = withTiming(0.26);
      opacity.value = 0.5;
    })
    .onStart(e => {
      if (dist(translation.value, { x: e.x, y: e.y }) < longPressHitSlop) {
        onLongPress && runOnJS(onLongPress);
        runOnJS(ReactNativeHapticFeedback.trigger)(
          'effectClick',
          hapticOptions,
        );
        scale.value = withDelay(200, withTiming(0));
        underlayOpacity.value = withTiming(0);
        opacity.value = 1;
      }
    })
    .onEnd(e => {
      if (
        dist(translation.value, { x: e.x, y: e.y }) > longPressHitSlop &&
        e.state !== 3
      ) {
        onPress && runOnJS(onPress);
        console.log('tap');

        runOnJS(ReactNativeHapticFeedback.trigger)(
          'effectClick',
          hapticOptions,
        );
      }
    })
    .onFinalize(() => {
      scale.value = withDelay(200, withTiming(0));
      underlayOpacity.value = withTiming(0);
      opacity.value = 1;
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={AnimatediOSStyle}>
        <View
          style={styles.underlay}
          onLayout={e => {
            const { height, width } = e.nativeEvent.layout;
            setRadius(Math.sqrt(width ** 2 + height ** 2));
          }}
        >
          {radius !== -1 && Platform.OS === 'android' && (
            <Animated.View
              style={[
                {
                  backgroundColor: rippleColor,
                  borderRadius: radius,
                  width: radius * 2,
                  height: radius * 2,
                },
                animatedAndroidStyle,
              ]}
            />
          )}
        </View>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  underlay: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
});

export default RippleButton;
