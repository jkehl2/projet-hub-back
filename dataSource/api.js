const { location, dispatchAction } = action;
if (location.trim() === '') {
  store.dispatch(appErrorClean());
  store.dispatch(appMsgClean());
  return;
}
const query = querystring.stringifyUrl({
  url: apiConfig.URL_GEOCODE,
  query: {
    adressdetails: 1,
    q: location,
    format: 'json',
    limit: 1,
  },
});
axios.get(query)
  .then((response) => {
    const geolocArr = response.data;
    if (geolocArr.length > 0) {
      const payload = {
        ...action.payload,
        lat: parseFloat(geolocArr[0].lat),
        long: parseFloat(geolocArr[0].lon),
      };
      store.dispatch(dispatchAction(payload));
    }
    else {
      store.dispatch(appMsgUpdate('Localité inconnue merci de préciser.'));
    }
  })
  .catch((error) => {
    store.dispatch(appErrorUpdate(error.message));
  })
  .finally(() => {
    store.dispatch(appLoadingOff());
  });
store.dispatch(appErrorClean());
store.dispatch(appMsgClean());
store.dispatch(appLoadingOn());
return;
}
}      