import { genders } from '@/lib/data/constants';
import { authenticateUser } from '@/services/api';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRouter } from 'next/router';
import Input from '@/components/shared/Input';
import { useInput } from '@/hooks/useInput';
import {
  getDummyUser,
  setDummyUserIntoLocalStorage,
} from '@/lib/utility/localStorage';

type userData = {
  email: string;
  userName: string;
  name: string;
  description: string;
  gender: string;
  password: string;
  dateOfBirth: Date;
};
const ProfilePage = () => {
  const router = useRouter();
  let user: userData = {} as userData;
  if (typeof localStorage !== 'undefined') {
    user = JSON.parse(getDummyUser() as string);
  }
  const {
    inputValue: userName,
    setInputValue: setUserName,
    onBlurHandler: handleUserNameBlur,
    onChangeHandler: handleUserNameChange,
    error: userNameErrorMessage,
    setError: setUserNameErrorMessage,
  } = useInput({
    dafaultValue: user?.userName || '',
    maxLength: 10,
    minLength: 6,
    type: 'username',
  });

  const {
    inputValue: email,
    setInputValue: setEmail,
    onBlurHandler: handleEmailBlur,
    onChangeHandler: handleEmailChange,
    error: emailErrorMessage,
    setError: setEmailErrorMessage,
  } = useInput({
    dafaultValue: user?.email || '',
    type: 'email',
  });
  const {
    inputValue: name,
    setInputValue: setName,
    onBlurHandler: handleNameBlur,
    onChangeHandler: handleNameChange,
    error: nameErrorMessage,
    setError: setNameErrorMessage,
  } = useInput({
    dafaultValue: user?.name || '',
    type: 'name',
  });

  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(
    user?.dateOfBirth
  );
  const [dateOfBirthErrorMessage, setDateOfBirthErrorMessage] = useState('');

  const [gender, setGender] = useState(user?.gender || '');

  const [genderErrorMessage, setGenderErrorMessage] = useState('');
  const [description, setDescription] = useState(user?.description || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      setGenderErrorMessage('');
    } else {
      setGenderErrorMessage('Please select a gender');
    }
    setGender(selectedValue);
  };

  const handleGenderBlur = function () {
    if (gender.length === 0) {
      setGenderErrorMessage('Please select a gender');
    }
  };
  const handleDateOfBirthChange = function (date: Date | null) {
    if (date) {
      setDateOfBirthErrorMessage('');
    }
    setDateOfBirth(date);
  };
  const handleDateOfBirthBlur = function () {
    if (!dateOfBirth) {
      setDateOfBirthErrorMessage('Please select a date of birth');
    }
  };

  const canSubmitForm = function () {
    if (!email) {
      setEmailErrorMessage("can't be empty");
    } else if (!userName) {
      setUserNameErrorMessage("can't be empty");
    } else if (!name) {
      setNameErrorMessage("can't be empty");
    } else if (!dateOfBirth) {
      setDateOfBirthErrorMessage('Please select a date of birth');
    } else if (!gender) {
      setGenderErrorMessage('Please select a gender');
    }
    const result = email && userName && name && dateOfBirth && gender;
    return result;
  };

  const handleFormSubmit = async function (
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    // TODO: Add form submission logic here
    const requestBody = {
      email,
      userName,
      name,
      description,
      gender,
      dateOfBirth: new Date(dateOfBirth as Date)?.toISOString(),
    };
    if (canSubmitForm()) {
      setIsLoading(true);
      const response = await authenticateUser(requestBody);
      if (response.token) {
        setDummyUserIntoLocalStorage(JSON.stringify(requestBody));
        router.push('/');
      }
      setIsLoading(false);
      console.log('Form submitted:', requestBody);
    }
  };
  const handleCancelRequest = function () {
    setDateOfBirth(user?.dateOfBirth);
    setGender(user?.gender);
    setDescription(user?.description);
    setName(user?.name);
    setEmail(user?.email);
    setUserName(user?.userName);
  };
  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm mb-10 px-4">
      <h2 className="text-lg font-semibold leading-7 text-gray-900 mb-4">
        Personal Information
      </h2>

      <form className="space-y-6" onSubmit={handleFormSubmit}>
        <Input
          id="email"
          type="email"
          label="Email Address*"
          value={email}
          error={emailErrorMessage}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
        />
        <Input
          id="userName"
          type="text"
          label="Username*"
          placeholder="emilys"
          value={userName}
          error={userNameErrorMessage}
          onChange={handleUserNameChange}
          onBlur={handleUserNameBlur}
        />

        <Input
          id="name"
          type="text"
          label="Name*"
          placeholder="Rahul"
          value={name}
          error={nameErrorMessage}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
        />
        <div className="sm:flex items-center justify-between xs:space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Date of Birth
            </label>
            <div className="mt-2 w-full">
              <DatePicker
                name="startDate"
                id="startDate"
                selected={dateOfBirth}
                onChange={handleDateOfBirthChange}
                onBlur={handleDateOfBirthBlur}
                maxDate={new Date()}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                closeOnScroll={true}
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                dateFormat="dd/MM/yyyy"
              />
              {dateOfBirthErrorMessage && (
                <div className="text-red-700">{dateOfBirthErrorMessage}</div>
              )}
            </div>
          </div>
          <div className="sm:w-1/2">
            <label
              htmlFor="country"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Gender
            </label>
            <div className="block w-full mt-2">
              <select
                value={gender}
                onChange={handleGenderChange}
                onBlur={handleGenderBlur}
                className="block w-full font-medium rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Select your gender</option>
                {genders.map((ele) => (
                  <option key={ele.value} value={ele.value}>
                    {ele.label}
                  </option>
                ))}
              </select>
              {genderErrorMessage && (
                <div className="text-red-700">{genderErrorMessage}</div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="about"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Description
          </label>
          <div className="mt-2">
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              rows={3}
              className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancelRequest}
            className="flex min-w-20   justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex min-w-20  justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {isLoading ? 'Loading...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
