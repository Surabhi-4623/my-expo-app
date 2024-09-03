import { Stack } from 'expo-router';
import {FlatList,Text,Image } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from 'react';



export default function Home() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [localAssets, setLocalAssets]=useState<MediaLibrary.Asset[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [endCursor, setEndCursor] = useState<string>();
  const [loading, setLoading] =useState(false);

  useEffect(()=>{
    if(permissionResponse?.status !== 'granted'){
      requestPermission();
    }
  
  },[]);

  useEffect(() => {
    if(permissionResponse?.status === 'granted'){
      loadLocalAssets();
    }
  },[permissionResponse]);

  const loadLocalAssets = async() =>{
    if(loading || !hasNextPage){
      return;
    }
    setLoading(true);
    console.log('Loading');
    const assetPage= await MediaLibrary.getAssetsAsync({after : endCursor});
    //console.log(JSON.stringify(assetPage,null,2));

    setLocalAssets((existingItems) =>[ ...existingItems, ...assetPage.assets]);
    
    setHasNextPage(assetPage.hasNextPage);
    setEndCursor(assetPage.endCursor);
    setLoading(false);

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
      onEndReached={loadLocalAssets}
      onEndReachedThreshold={1}
      refreshing={loading}
       renderItem={({item}) => <Image source={{uri : item.uri}} style={{width:'25%', aspectRatio:1}}/> }
      />
   
    </>
  );
}

