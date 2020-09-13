import {useReducer, useCallback} from 'react';

const intitialState ={
    loading:false,
    error:null,
    data:null,
    extra:null,
    identifier: null
};

const httpReducer = (curHttpState, action) =>{
    switch(action.type){
      case 'SEND':
        return {loading: true, error:null, data: null, extra:null, identifier: action.identifier}
      case 'RESPONSE':
        return {...curHttpState, loading: false, data: action.responseData, extra: action.extra}
      case 'ERROR':
        return {loading: false, error: action.errorMessage}
      case 'CLEAR':
          return intitialState
        default:
          throw new Error('Should not get there!');
    }
  }

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer,intitialState )

    const clear = useCallback(() => dispatchHttp({type: 'CLEAR'}),[]);

    const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifier) =>{
        dispatchHttp({type: 'SEND', identifier: reqIdentifier});
        fetch(url, {
            method: method,
            body: body,
            header:{
                'Content-Type':'application/json'
            }
          }).then(response =>{
              return response.json();
          }).then(responseData => {
              dispatchHttp({type: 'RESPONSE', responseData: responseData,  extra: reqExtra});
          })
          .catch(error => {
            dispatchHttp({type: 'ERROR', errorMessage: 'Something went Worng!'})
          })
    }, [])
    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        sendRequest: sendRequest,
        reqExtra: httpState.extra,
        reqIdentifier: httpState.identifier,
        clear:clear
    }
};

export default useHttp;