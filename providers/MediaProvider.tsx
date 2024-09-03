import { createContext, PropsWithChildren, useContext,useEffect, useState } from "react";
import * as MediaLibrary from 'expo-media-library';

type MediaContextType={
    assets: MediaLibrary.Asset[];
    loadLocalAssets: () => void;
}

const MediaContext=createContext<MediaContextType>({
    assets: [],
    loadLocalAssets: () => {},
});

export default function MediaContextProvider({children}: PropsWithChildren){
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
 



    return(
        <MediaContext.Provider value={{ assets: localAssets, loadLocalAssets}}>
            {children}
        </MediaContext.Provider>
    )
}

export const useMedia =() => useContext(MediaContext);