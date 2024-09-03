import { Stack } from 'expo-router';
import {FlatList,Text,Image } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from 'react';



export default function Home() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [localAssets, setLocalAssets]=useState<MediaLibrary.Asset[]>([]);
  useEffect(()=>{
    if(permissionResponse?.status !== 'granted'){
      requestPermission();
    }
  
  },[]);

  useEffect(() => {
    if(permissionResponse?.status === 'granted'){
      loadLocalAssets();
    }
  },[permissionResponse])

  const loadLocalAssets = async() =>{
    const assetPage= await MediaLibrary.getAssetsAsync();
    console.log(JSON.stringify(assetPage,null,2));

    setLocalAssets(assetPage.assets)
  };

  console.log(permissionResponse);
  return (
    <>
      <Stack.Screen options={{ title: 'Photos' }} />
      <FlatList
       data={localAssets} 
       numColumns={4}
      //  columnWrapperStyle={{gap:2}}
      //  contentContainerStyle={{gap:2}}
      contentContainerClassName="gap-[2px]"
      columnWrapperClassName='gap-[2px]'
       renderItem={({item}) => <Image source={{uri : item.uri}} style={{width:'25%', aspectRatio:1}}/> }
      />
    </>
  );
}

