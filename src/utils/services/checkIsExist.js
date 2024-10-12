

export const checkIsExist=(arr,value,type)=>{
    let isExist=false;
    for (let index = 0; index < arr.length; index++) {
        if(arr[index][type]==value){
            isExist=true
            break
        }
        
    }
    return isExist;
}