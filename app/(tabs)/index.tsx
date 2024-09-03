import { Stack } from 'expo-router';
import {FlatList,Image } from 'react-native';
import { useMedia } from '~/providers/MediaProvider';



export default function Home() {
  const {assets,loadLocalAssets} =useMedia();


   return (
    <>
      <Stack.Screen options={{ title: 'Photos' }} />
      <FlatList
       data={assets} 
       numColumns={4}
      //  columnWrapperStyle={{gap:2}}
      //  contentContainerStyle={{gap:2}}
      contentContainerClassName="gap-[2px]"
      columnWrapperClassName='gap-[2px]'
      onEndReached={loadLocalAssets}
      onEndReachedThreshold={1}
      //refreshing={loading}
       renderItem={({item}) => <Image source={{uri : item.uri}} style={{width:'25%', aspectRatio:1}}/> }
      />
   
    </>
  );
}

