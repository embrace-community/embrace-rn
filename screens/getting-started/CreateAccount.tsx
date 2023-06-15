import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { NativeStackNavigationHelpers } from '@react-navigation/native-stack/lib/typescript/src/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import classNames from 'classnames';
import { MY_PROFILES_COLLECTION, API_ENDPOINT } from 'react-native-dotenv';
import { createWallet } from '../../libraries/Wallet';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { LocalDbContext } from '../../libraries/LocalDbProvider';

type Props = {
  navigation: NativeStackNavigationHelpers;
};

export default function CreateAccount({ navigation }: Props) {
  const localDb = useContext(LocalDbContext);

  const [handle, setHandle] = useState('martinopensky');
  const [displayName, setDisplayName] = useState('Martin');
  const [image, setImage] = useState(null);
  const [cids, setCids] = useState(null);

  const [loading, setLoading] = useState(false);

  type CID = {
    metadataUri: string;
    avatarUri?: string;
  };

  // Update local profiles once CIDs have been set
  useEffect(() => {
    async function updateLocalProfile() {
      if (!localDb || !cids || !handle) return;

      console.log('SETTING PROFILE CIDS', cids);

      const data: CID = {
        metadataUri: `ipfs://${cids.metadataCid}`,
      };

      if (cids.avatarCid) {
        data.avatarUri = `ipfs://${cids.avatarCid}`;
      }

      await localDb[MY_PROFILES_COLLECTION].findOne(handle).update({
        $set: data,
      });
    }

    updateLocalProfile();
  }, [localDb, cids, handle]);

  const initAccount = async () => {
    // Validate form - handle and display name
    if (!handle || !displayName) {
      return Alert.alert('Please enter a valid handle and display name');
    }

    setLoading(true);

    // Create wallet
    const accountAddress = await createWallet();

    // Save profile to local DB - will be synced to Polybase
    const profile = createProfile(accountAddress);

    // Upload metadata & avatar to IPFS
    // Once CIDs have been set then they will be saved to Profile collection
    uploadMetadata();

    setLoading(false);

    console.log('profile', profile);

    navigation.navigate('Main', {
      screen: 'Account',
    });
  };

  const pickImage = useCallback(async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const selectedImage = result.assets[0];

        const fileInfo = await FileSystem.getInfoAsync(selectedImage.uri);

        //@ts-ignore - types are incorrect for fileInfo
        const compress = compressSizer(fileInfo.size);

        console.log('fileInfo', fileInfo);
        console.log('compress', compress);

        const compressedImage = await manipulateAsync(
          result.assets[0].uri,
          [],
          {
            compress,
            format: SaveFormat.JPEG,
          },
        );
        setImage(compressedImage.uri);

        console.log('SELECTED IMAGE', result.assets[0].uri);
        console.log('COMPRESSED IMAGE', compressedImage.uri);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  const compressSizer = (size: number) => {
    const MB = size / Math.pow(1024, 2);
    if (Math.round(MB) === 0) return 1;
    if (Math.round(MB) === 1) return 0.8;
    if (Math.round(MB) < 5) return 0.1;
    if (Math.round(MB) >= 5) return 0;
  };

  // Local validation of handle
  const validateHandle = (text: string) => {
    const handleRegex = /^[a-zA-Z0-9_]{1,15}$/;
    if (handleRegex.test(text)) {
      console.log('setHandle', text);
      setHandle(text.toLowerCase());
    }
  };

  // Upload profile metadata to IPFS
  const uploadMetadata = async () => {
    console.log('uploadMetadata');

    try {
      const data = new FormData();

      if (image) {
        data.append('image', {
          uri: image,
          type: 'image/jpg',
          name: 'image.jpg',
        } as any);
      }

      data.append('name', displayName);
      data.append('handle', handle);

      console.log('UPLOADING PROFILE', data, API_ENDPOINT + 'profile');

      let res = await fetch(API_ENDPOINT + 'profile', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: data,
      });

      let result = await res.json();

      if (res.status !== 200) {
        console.log('Problem uploading metadata', result, res.status);
        return false;
      }

      setCids(result);
      return true;
    } catch (error) {
      // Error retrieving data
      // Alert.alert('Error', error.message);
      console.log('error upload', error);
    }
  };

  // Creating profile in local DB
  const createProfile = async (accountAddress: string) => {
    console.log('Creating profile');

    const profile = {
      address: accountAddress,
      handle,
      displayName,
      avatarUri: image,
    };

    localDb[MY_PROFILES_COLLECTION].upsert(profile).catch((e) =>
      console.log('RxDB Error', e),
    );

    return profile;
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center bg-white">
        <View className="absolute left-0 top-0 z-10 h-48 w-full items-center bg-violet-200">
          <TouchableOpacity className="mt-24 flex" onPress={pickImage}>
            <View
              className={classNames({
                'h-56 w-56 items-center justify-center rounded-full bg-slate-100':
                  true,
                'border-8 border-violet-700/40': image,
              })}
            >
              {!image ? (
                <AntDesign
                  name="plus"
                  size={48}
                  color="black"
                  style={{ zIndex: 0 }}
                />
              ) : (
                <Image
                  source={{ uri: image }}
                  className="left-0 top-0 flex h-52 w-52 rounded-full"
                />
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View className="flex-1 gap-4 pt-96">
          <TextInput
            className="w-80 rounded-lg border-2 border-slate-200 bg-white p-4"
            placeholderTextColor="#ccc"
            placeholder="handle"
            value={handle}
            onChangeText={validateHandle}
          />

          <TextInput
            className="w-80 rounded-lg border-2 border-slate-200 bg-white p-4"
            placeholderTextColor="#ccc"
            placeholder="display name"
            value={displayName}
            onChangeText={setDisplayName}
          />
        </View>
        <View className="flex w-full flex-row gap-4 bg-white p-4">
          <TouchableOpacity
            className="flex-1"
            onPress={() => navigation.navigate('GettingStarted')}
          >
            <Button className="border-slate-300 bg-slate-200">
              <Text className="text-slate-600">Back</Text>
            </Button>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1"
            onPress={initAccount}
            disabled={loading}
          >
            <Button
              className={classNames({
                'border-violet-100 bg-violet-600': true,
                'border-violet-200 bg-violet-100': loading,
              })}
            >
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color="#7C3AED"
                  className="mr-2"
                />
              ) : (
                <Text className="text-white">Create Account</Text>
              )}
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const Button = styled(
  View,
  'items-center justify-center rounded-lg p-3 h-16 border-2',
);
