import { useEffect, useRef, useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import {
  BaseButton,
  RectButton,
  TextInput,
} from 'react-native-gesture-handler';
import { CreateEmployerNavigationProps } from 'src/types/navigation';
import { colors } from 'src/utils/constants';
import cardStyle from 'src/Components/EmployerCard/styles';
import { useAppDispatch } from 'src/redux/hooks';
import { addEmployer } from 'src/redux/punches';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFilteredEmployerData } from 'src/utils/hooks';
import React from 'react';

type CreateEmployerType = CreateEmployerNavigationProps;

const CreateEmployer = ({ navigation }: CreateEmployerType) => {
  useEffect(() => {
    console.log('rerender');
  });
  const dispatch = useAppDispatch();
  const employers = useFilteredEmployerData();
  const employer = useRef('');
  const [error, setError] = useState('');
  const employerRef = useRef<TextInput>(null);
  const notesRef = useRef<TextInput>(null);

  const handleChangeEmployer = (text: string) => {
    setError('');
    employer.current = text;
  };

  const handleDone = () => {
    if (
      employers.find(data => {
        return (
          data.employer.toLocaleLowerCase() ===
          employer.current.toLocaleLowerCase()
        );
      })
    ) {
      setError('This employer already exists!');
    } else {
      dispatch(addEmployer({ employer: employer.current }));
      navigation.goBack();
    }
  };

  useEffect(() => {
    employerRef.current?.focus();
  }, []);

  return (
    <BaseButton
      style={styles.root}
      onPress={Keyboard.dismiss}
      rippleColor={'transparent'}
    >
      <View
        style={[
          cardStyle.root,
          styles.card,
          { borderColor: error ? colors.PRIMARY_RED : colors.BORDER },
        ]}
      >
        <TextInput
          onChangeText={handleChangeEmployer}
          ref={employerRef}
          style={styles.textInput}
          placeholder="Employer"
          autoCapitalize="words"
          onSubmitEditing={notesRef.current?.focus}
        />
        <Text style={styles.errorText}>{error}</Text>
      </View>
      <RectButton
        style={styles.doneButton}
        rippleColor={colors.PRIMARY_WHITE}
        onPress={handleDone}
      >
        <Icon name="check" size={36} />
      </RectButton>
    </BaseButton>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: 100,
    backgroundColor: `${colors.BLACK}AA`,
  },
  card: {
    alignSelf: 'center',
    position: 'absolute',
    top: 150,
    width: '90%',
    height: 100,
    paddingHorizontal: 10,
  },
  textInput: {
    fontSize: 20,
    flex: 1,
  },
  doneButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    top: 275,
    right: '10%',
    backgroundColor: colors.PRIMARY_GREEN,
  },
  errorText: {
    fontSize: 16,
    color: colors.PRIMARY_RED,
    marginTop: 10,
  },
});

export default React.memo(CreateEmployer);
